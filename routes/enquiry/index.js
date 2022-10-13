const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const GetAPI = require('./Get')
const PostAPI = require('./Post')

module.exports = [{
        method: 'post',
        path: '/enquiry',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["enquiry"].Post.ApiDescription,
            tags: ['api', 'enquiry'],
            auth: {
                strategies: ['basic','user', 'admin']
            },
            validate: {
                headers: headerValidator.headerAuth,
                payload: PostAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: PostAPI.response
        }
    },
    {
        method: 'get',
        path: '/enquiry',
        handler: GetAPI.handler,
        config: {
            cors: true,
            description: locals["enquiry"].Get.ApiDescription,
            tags: ['api', 'enquiry'],
            auth: {
                strategies: ['basic', 'user', 'admin']
            },
            validate: {
                headers: headerValidator.headerAuth,
                query: GetAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: GetAPI.response
        }
    }
]