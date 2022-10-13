const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const GetAPI = require('./Get')
const PostAPI = require('./Post')
const DeleteAPI = require('./Delete')
const PatchAPI = require('./Patch')

module.exports = [{
        method: 'post',
        path: '/section',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["section"].Get.ApiDescription,
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
        path: '/section',
        handler: GetAPI.handler,
        config: {
            cors: true,
            description: locals["section"].Get.ApiDescription,
            tags: ['api', 'section'],
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
    },
    {
        method: 'delete',
        path: '/section',
        handler: DeleteAPI.handler,
        config: {
            cors: true,
            description: locals["sub-category"].Delete.ApiDescription,
            tags: ['api', 'product'],
            auth: {
                strategies: ['basic', 'user', 'admin']
            },
            validate: {
                headers: headerValidator.headerAuth,
                query: DeleteAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: DeleteAPI.response
        }
    },{
        method: 'patch',
        path: '/section',
        handler: PatchAPI.handler,
        config: {
            cors: true,
            description: locals["section"].Get.ApiDescription,
            tags: ['api', 'section'],
            auth: {
                strategies: ['basic', 'user', 'admin']
            },
            validate: {
                headers: headerValidator.headerAuth,
                payload: PatchAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: PatchAPI.response
        }
    }
]