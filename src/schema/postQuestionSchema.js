const schema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                title: {
                    type: 'string'
                },
                responsetype: {
                    type: 'string'
                },
                options: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                }
            },
            required: ['title', 'responsetype', 'options']
        },
        requestContext: {
            type: 'object',
            properties: {
                authorizer: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string'
                        }
                    },
                    required: ['email']
                }
            },
            required: ['authorizer']
        },
    },
    required: ['body', 'requestContext']
}

module.exports = schema;