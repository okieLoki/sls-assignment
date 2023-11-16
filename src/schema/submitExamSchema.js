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
                    type: 'string',
                    enum: ['MCQ', 'descriptive']
                },
                response: {
                    type: 'string',
                    enum: ['a', 'b', 'c', 'd']
                },
                descriptiveresponse: {
                    type: 'string'
                }
            },
            required: [
                'teacherID',
                'questionID',
                'responsetype',
            ]
        }
    },
    required: [
        'body'
    ]
}

module.exports = schema;