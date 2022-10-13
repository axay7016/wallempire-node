const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const GetAPI = require('./Get')
const PostAPI = require('./Post')
const PutAPI = require('./Put')
const DeleteAPI = require('./Delete')
const UploadAPI = require('./upload/Post')
const DeleteImageAPI = require('./upload/Delete')
const UpdateImageAPI = require('./upload/Update')

module.exports = [{
        method: 'post',
        path: '/product',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["product"].Post.ApiDescription,
            tags: ['api', 'product'],
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
    },{
        method: 'post',
        path: '/upload',
        handler: UploadAPI.handler,
        config: {
            cors: true,
            description: locals["product"].Post.ApiDescription,
            tags: ['api', 'product'],
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
                payload: UploadAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: PostAPI.response
        }
    },
    {
        method: 'get',
        path: '/product',
        handler: GetAPI.handler,
        config: {
            cors: true,
            description: locals["product"].Get.ApiDescription,
            tags: ['api', 'product'],
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
        path: '/product-delete',
        handler: DeleteImageAPI.handler,
        config: {
            cors: true,
            description: locals["product"].Post.ApiDescription,
            tags: ['api', 'product'],
            auth: {
                strategies: ['basic', 'user', 'admin']
            },
            validate: {
                headers: headerValidator.headerAuth,
                query: DeleteImageAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: PostAPI.response
        }
    },
    {
        method: 'patch',
        path: '/product-update',
        handler: UpdateImageAPI.handler,
        config: {
            cors: true,
            description: locals["product"].Post.ApiDescription,
            tags: ['api', 'product'],
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
                payload: UpdateImageAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: PostAPI.response
        }
    },
    {
        method: 'put',
        path: '/product',
        handler: PutAPI.handler,
        config: {
            cors: true,
            description: locals["product"].Put.ApiDescription,
            tags: ['api', 'product'],
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
                payload: PutAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: PutAPI.response
        }
    },
    {
        method: 'delete',
        path: '/product',
        handler: DeleteAPI.handler,
        config: {
            cors: true,
            description: locals["product"].Put.ApiDescription,
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
    }
]