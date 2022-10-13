const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const GetAPI = require('./Get')
const PostAPI = require('./Post')

module.exports = [{
        method: 'post',
        path: '/banner',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["banner"].Post.ApiDescription,
            tags: ['api', 'banner'],
            auth: {
                strategies: ['basic', 'user', 'admin']
            },
            payload: {
                output: 'data',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 1024 * 1024 * 100,
                timeout: false,
                multipart: true
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
        path: '/banner',
        handler: GetAPI.handler,
        config: {
            cors: true,
            description: locals["banner"].Get.ApiDescription,
            tags: ['api', 'banner'],
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