import registry from './registry'
import model from './model'
import policy from './policy'
import roleTask from './role-task'
import process from './process'
import workItem from './work-item'
import nominate from './nominate'
import release from './release'
import voteNominate from './vote-nominate'
import voteRelease from './vote-release'

const mutate = web3 =>
  func =>
    async (
      _,
      params,
    ):Promise<any> =>
        func({
          ...params,
          web3,
        })

export default (web3): object => ({
  registry: mutate(web3)(registry),
  model: mutate(web3)(model),
  process: mutate(web3)(process),
  policy: mutate(web3)(policy),
  roleTask: mutate(web3)(roleTask),
  nominate: mutate(web3)(nominate),
  release: mutate(web3)(release),
  voteNominate: mutate(web3)(voteNominate),
  voteRelease: mutate(web3)(voteRelease),
  workItem: mutate(web3)(workItem)
})