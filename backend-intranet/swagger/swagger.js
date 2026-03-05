const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Japfa Intranet API',
    description: 'Auto-generated docs',
  },
  servers: [
    {
      url: process.env.BASE_URL,
      description: 'Local server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  tags: [
    { name: 'Auth', description: 'Authentication APIs' },
    { name: 'Master', description: 'Master APIs' },
    { name: 'Requests', description: 'Request APIs' }
  ],
};

const outputFile = './swagger/swagger_output.json';
const endpointsFiles = [
  './routes/auth.routes.js',
  './routes/master.routes.js',
  './routes/request.routes.js',
  './routes/policy.routes.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);
