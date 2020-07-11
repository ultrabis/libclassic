import utils from './utils'

import Settings from '../interface/Settings'
import MoonkinDefaults from '../obj/moonkin-settings.json'
import PlayableSpec from '../enum/PlayableSpec'

const fromDefaults = (opts?: { playerSpec: PlayableSpec }): Settings => {
  if (!opts) {
    return utils.cloneObject(MoonkinDefaults)
  }

  switch (opts.playerSpec) {
    case PlayableSpec.Moonkin:
    default:
      return utils.cloneObject(MoonkinDefaults)
  }
}

export default {
  fromDefaults
}
