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
                    type: 'string',
                    enum: ['MCQ', 'descriptive']
                },
                options: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                }
            },
            required: ['title', 'responsetype']
        }
    },
    required: ['body']
}

module.exports = schema;