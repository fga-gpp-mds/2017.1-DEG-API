import { Router } from 'express'
import Coordinator from '../models/coordinator'
import Answer from '../models/answer'
import Form from '../models/form'
import { getCorrectError } from '../helpers/errorHandling'
import _ from 'lodash'

export default ({ config, db }) => {
  let router = Router()

  router.param('coordinator', async (req, resp, next, registration) => {
    req.coordinator = Coordinator.get(registration)
    next()
  })

  router.get('/', async (request, response) => {
    try {
      response.json(await Coordinator.orderBy('name').run())
    } catch (error) {
      response.status(404).json({error: error})
    }
  })

  router.get('/:coordinator', async ({ coordinator }, response) => {
    try {
      var result = await coordinator.getJoin({forums: true}).run()
      // result = _.pick(result, ['registration', 'name', 'email', 'course', 'forums'])
      response.json(result)
    } catch (error) {
      var errorMessage = getCorrectError(error,
        error.name,
        "Coordenador não encontrado",
        "Dados inválidos de coordenador " + error.message
      )

      var statusError = getCorrectError(error,
        404,
        404,
        400
      )
      response.status(statusError).json({ error: errorMessage })
    }
  })

  router.post('/', async ({ body, query }, response) => {
    var success = false
    try {
      var result = await Coordinator.save(body.coordinator)
      success = true
      response.json({ result, success })
    } catch (error) {
      // console.log(error)
      var errorMessage = getCorrectError(error,
        error.name,
        "Coordenador não encontrado",
        "Dados inválidos de coordenador " + error.message
      )

      var statusError = getCorrectError(error,
        404,
        404,
        400
      )
      response.status(statusError).json({ error: errorMessage, success })
    }
  })

  router.put('/:coordinator', async ({ coordinator, body }, response) => {
    var success = false
    try {
      // var result = await coordinator.update(body.coordinator).run()
      var coordInstance = await coordinator.run()
      var result = await coordInstance.merge(body.coordinator).save()
      var old = await coordInstance.getOldValue()
      success = true
      response.json({ result, old, success })
    } catch (error) {
      // console.log(error)
      var statusError = getCorrectError(error,
        404,
        404,
        400,
        400
      )

      var errorMessage = getCorrectError(error,
        error.name,
        "Coordenador não encontrado",
        "Dados inválidos de coordenador " + error.message,
        "Um erro ocorreu ao alterar esse cordenador " + error.message
      )
      response.status(statusError).json({ error: errorMessage, success })
    }
  })

  router.delete('/:coordinator', async ({ coordinator }, response) => {
    var success = false
    try {
      var coordinatorInstance = await coordinator
      var result = await coordinatorInstance.delete()
      success = true
      response.json({ result, success })
    } catch(error) {
      var errorMessage = getCorrectError(error,
        error.name,
        "Coordenador não encontrado"
      )
      response.status(404).json({ error: errorMessage, success })
    }
  })

  router.post('/:coordinator/forum/:forum',
    async ({ coordinator, params }, response) => {
    var success = false
    try {
      var coordinatorInstance = await coordinator
      var result = coordinatorInstance.addRelation("forums", {id: params.forum})
      success = true
      response.json({ result , success })
    } catch (error) {
      response.status(404).json({ error: error.name, success })
    }
  })

  router.delete('/:coordinator/forum/:forum',
    async ({ coordinator, params }, response) => {
      var success = false
      try {
        var coordinatorInstance = await coordinator
        var result = coordinatorInstance.removeRelation("forums", {id: params.forum}).run()
        success = true
        response.json({ result, success })
      } catch (error) {
        // console.log(error)
        var errorMessage = getCorrectError(error, error.name, "Coordenador não encontrado.")
        var errorStatus = getCorrectError(error, 404, 401)

        response.status(errorStatus).json({ error: errorMessage, success })
      }
    })

    router.get('/:coordinator/forum/:forum',
      async ({ coordinator, params }, response) => {
      var success = false
      try {
        var result = await coordinator.getJoin({
          forums: true
        }).run()

        result.forums.forEach((forum) => {
          // console.log(forum)
          if (forum.id === params.forum){
            success = true
          }
        })

        response.json({ success })
      } catch (error) {
        var errorMessage = getCorrectError(error,
          error.name,
          "Coordenador não encontrado",
          "Dados inválidos de coordenador " + error.message
        )

        var statusError = getCorrectError(error,
          404,
          404,
          400
        )
        response.status(statusError).json({ error: errorMessage })
      }
    })

    router.post('/:coordinator/answer/:form',
      async ({ coordinator, params, body }, response) => {
        var success = false
        try {
          var coordinatorInstance = await coordinator
          var formInstance = await Form.get(params.form)

          var coordinatorAnswers = await coordinator.getJoin({
            answers: true
          }).run()
          coordinatorAnswers = coordinatorAnswers.answers.map((answer) => {
            return answer.formId === formInstance.id
          }).indexOf(true)

          if (coordinatorAnswers > -1) {
            throw new Error('Coordenador já respondeu este formulário.')
          }

          var answerInstance = await Answer.save(body.answer)
          var result = await answerInstance.addRelation("form", { id: formInstance.id })
          result = await answerInstance.addRelation("coordinator", { registration: coordinatorInstance.registration })

          success = true
          response.json({ result, success })
        } catch (error) {
          var errorMessage = getCorrectError(error,
            error.message,
            "Coordenador não encontrado",
            "Dados inválidos de coordenador " + error.message
          )

          var statusError = getCorrectError(error,
            404,
            404,
            400
          )
          response.status(statusError).json({ error: errorMessage, success })
        }
      })

  return router
}
