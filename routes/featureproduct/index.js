const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const PostAPI = require('./Post')
const GetAPI = require('./Get')

module.exports = [{
        method: 'post',
        path: '/featuredProduct',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["featureProduct"].Post.ApiDescription,
            tags: ['api', 'section'],
            auth: {
                strategies: ['basic', 'user', 'admin']
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
        path: '/featuredProduct',
        handler: GetAPI.handler,
        config: {
            cors: true,
            description: locals["featureProduct"].Get.ApiDescription,
            tags: ['api', 'category'],
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