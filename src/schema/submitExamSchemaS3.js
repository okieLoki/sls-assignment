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
                file: {
                    type: 'string'
                }
            },
            required: [
                'teacherID',
                'questionID',
                'file'
            ]
        }
    },
    required: ['body']
}

module.exports = schema;