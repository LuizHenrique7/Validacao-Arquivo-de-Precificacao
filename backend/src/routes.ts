import { Router, Request, Response } from 'express';
import { Readable } from 'stream';
import readline from 'readline';
import multer from 'multer';
import { pool } from './db';
import { OkPacket, RowDataPacket } from 'mysql2';

const multerConfig = multer({});
const router = Router();

router.post('/update-prices', async (request: Request, response: Response) => {
  const { updatedProducts } = request.body;
  let connection;

  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();

    if (!Array.isArray(updatedProducts)) {
      return response.status(400).json({ error: 'updatedProducts não é um array válido' });
    }

    for (const updatedProduct of updatedProducts) {
      const { code, newPrice } = updatedProduct;

      if (code === undefined || newPrice === undefined) {
        return response.status(400).json({ error: 'Código do produto ou novo preço não definido' });
      }

      try {
        const [updateProductResult] = await connection.execute<OkPacket>('UPDATE products SET sales_price = ? WHERE code = ?', [newPrice, code]);

        if (updateProductResult.affectedRows === 0) {
          return response.status(400).json({ error: `Produto com código ${code} não encontrado` });
        }

        const [packResult] = await connection.execute<RowDataPacket[]>('SELECT product_id, qty FROM packs WHERE pack_id = ?', [code]);

        if (packResult.length > 0) {
          for (const packItem of packResult) {
            const { product_id, qty } = packItem;
            const componentCode = product_id;
            const componentNewPrice = newPrice / qty;

            await connection.execute('UPDATE products SET sales_price = ? WHERE code = ?', [componentNewPrice, componentCode]);
          }
        }
      } catch (error) {
        console.error(`Erro ao atualizar preço do produto ${code}:`, error);
        throw error;
      }
    }

    await connection.commit();
    connection.release();

    return response.json({ message: 'Preços atualizados com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar preços:', error);

    if (connection) {
      await connection.rollback();
      connection.release();
    }

    return response.status(500).json({ error: 'Erro ao atualizar preços' });
  }
});


router.post("/products", multerConfig.single("file"), async (request: Request, response: Response) => {
  const { file } = request;

  if (!file) {
    return response.status(400).json({ error: "Nenhum arquivo fornecido" });
  }

  const readableFile = new Readable();
  readableFile.push(file.buffer);
  readableFile.push(null);

  const productsLine = readline.createInterface({
    input: readableFile,
  });

  const validatedProducts: any[] = [];

  for await (const line of productsLine) {
    const productData = line.split(",");
    const code = productData[0];
    const newPrice = parseFloat(productData[1]);

    const validationErrors: string[] = [];

    if (!code || isNaN(newPrice)) {
      validationErrors.push("Campos incompletos ou preço inválido");
    }

    try {
      const [dbProductResult] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count, (SELECT sales_price FROM products WHERE code = ?) as sales_price FROM products WHERE code = ?',
        [code, code]
      );

      if (dbProductResult[0].count === 0) {
        validationErrors.push(`Produto com código ${code} não encontrado no banco de dados`);
      } else {
        const current_sales_price = dbProductResult[0].sales_price;

        const maxAllowedChange = current_sales_price * 0.1; 

        if (Math.abs(newPrice - current_sales_price) > maxAllowedChange) {
          validationErrors.push("Reajuste de preço fora do limite permitido");
        }
      }
    } catch (error) {
      console.error(`Erro ao validar produto ${code}:`, error);
      throw error;
    }

    
    const product = {
      code,
      name: "", 
      cost_price: 0,
      sales_price: 0, 
      validationErrors,
      newPrice,
    };

    validatedProducts.push(product);
  }

  return response.json({ products: validatedProducts });
});


router.get('/get-products', async (request: Request, response: Response) => {
  try {
    const [products] = await pool.execute<RowDataPacket[]>('SELECT * FROM products');
    return response.json({ products });
  } catch (error) {
    console.error('Erro ao consultar produtos:', error);
    return response.status(500).json({ error: 'Erro ao consultar produtos' });
  }
});

router.get('/get-sales-price', async (request: Request, response: Response) => {
  const { code } = request.query;
  try {
    const [product] = await pool.execute<RowDataPacket[]>('SELECT name, cost_price, sales_price FROM products WHERE code = ?', [code]);

    if (product.length > 0) {
      const { name, cost_price, sales_price } = product[0];
      return response.json({ name, cost_price, sales_price });
    } else {
      return response.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar informações do produto:', error);
    return response.status(500).json({ error: 'Erro ao buscar informações do produto' });
  }
});



export { router };