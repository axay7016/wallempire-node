const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const GetAPI = require('./Get')
const PostAPI = require('./Post')
const PatchAPI = require('./Patch')
const DeleteAPI = require('./Delete')

module.exports = [{
        method: 'post',
        path: '/category',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["category"].Get.ApiDescription,
            tags: ['api', 'category'],
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
        path: '/category',
        handler: GetAPI.handler,
        config: {
            cors: true,
            description: locals["category"].Get.ApiDescription,
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
    },
    {
        method: 'delete',
        path: '/category',
        handler: DeleteAPI.handler,
        config: {
            cors: true,
            description: locals["category"].Get.ApiDescription,
            tags: ['api', 'category'],
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
    },
    {
        method: 'patch',
        path: '/category',
        handler: PatchAPI.handler,
        config: {
            cors: true,
            description: locals["category"].Get.ApiDescription,
            tags: ['api', 'category'],
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