const schema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                teacherID: {
                    type: 'string'
                },
                questionID: {
                    type: 'string'
                },
                responsetype: {
                    type: 'string'
                },
                response: {
                    type: 'string',
                    enum: ['a', 'b', 'c', 'd']
                },
            },
            required: [
                'teacherID',
                'questionID',
                'responsetype',
                'response'
            ]
        }
    },
    required: ['body']
}

module.exports = schema;