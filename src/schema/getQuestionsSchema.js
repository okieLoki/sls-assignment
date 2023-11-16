const schema = {
    type: 'object',
    properties:{
        queryStringParameters:{
            type:'object',
            properties:{
                id:{
                    type:'string'
                }
            },
            required:['id']
        }
    },
    required:['queryStringParameters']
}

module.exports = schema;