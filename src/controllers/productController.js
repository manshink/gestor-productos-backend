const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        
        // Construir el filtro
        const filter = {};
        if (query) {
            if (query.startsWith('category:')) {
                filter.category = query.split(':')[1];
            } else if (query.startsWith('status:')) {
                filter.status = query.split(':')[1] === 'true';
            }
        }

        // Construir el sort
        const sortOptions = {};
        if (sort === 'asc') {
            sortOptions.price = 1;
        } else if (sort === 'desc') {
            sortOptions.price = -1;
        }

        // Realizar la consulta con paginación
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOptions,
            lean: true
        };

        const result = await Product.paginate(filter, options);

        // Construir los links de paginación
        const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
        const queryParams = new URLSearchParams(req.query);
        
        const prevLink = result.hasPrevPage 
            ? `${baseUrl}?${queryParams.toString().replace(/page=\d+/, `page=${result.prevPage}`)}`
            : null;
            
        const nextLink = result.hasNextPage
            ? `${baseUrl}?${queryParams.toString().replace(/page=\d+/, `page=${result.nextPage}`)}`
            : null;

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }
        res.json({
            status: 'success',
            payload: product
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({
            status: 'success',
            payload: newProduct
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.pid,
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }
        res.json({
            status: 'success',
            payload: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }
        res.json({
            status: 'success',
            message: 'Producto eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getProductsView = async (req, res) => {
    try {
        console.log('Obteniendo productos...');
        const { page = 1, limit = 10, sort, query } = req.query;
        console.log('Parámetros:', { page, limit, sort, query });
        
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'desc' ? -1 : 1 } : undefined,
            lean: true
        };

        let filter = {};
        if (query) {
            const [field, value] = query.split(':');
            filter[field] = value;
        }
        console.log('Filtro:', filter);
        console.log('Opciones:', options);

        const result = await Product.paginate(filter, options);
        console.log('Resultado de la consulta:', {
            totalDocs: result.totalDocs,
            docs: result.docs.length,
            page: result.page,
            totalPages: result.totalPages
        });
        
        // Construir URLs para la paginación
        const baseUrl = '/products';
        const queryParams = new URLSearchParams(req.query);
        queryParams.delete('page');
        
        const prevLink = result.hasPrevPage 
            ? `${baseUrl}?${queryParams.toString()}&page=${result.prevPage}`
            : null;
            
        const nextLink = result.hasNextPage
            ? `${baseUrl}?${queryParams.toString()}&page=${result.nextPage}`
            : null;

        const viewData = {
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink,
            nextLink,
            query: req.query.query || '',
            sort: req.query.sort || ''
        };
        console.log('Datos enviados a la vista:', viewData);

        res.render('products/index', viewData);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al obtener los productos' });
    }
};

const getProductDetailView = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }
        res.render('products/detail', { product });
    } catch (error) {
        console.error('Error al obtener detalle del producto:', error);
        res.status(500).render('error', { message: 'Error al obtener el detalle del producto' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsView,
    getProductDetailView
}; 