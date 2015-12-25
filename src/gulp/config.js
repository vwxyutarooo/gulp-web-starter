'use strict';

/*------------------------------------------------------------------------------
 * 2. FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
------------------------------------------------------------------------------*/
// opt
// @param string: Choose css framework between foundatino and bootstrap
// @param string: Specific css framework version
// @param boolem: automatic _s install at the init task
// @param false or string: virtual host name of local machine such as . Set false to browser-sync start as server mode.
// @param false or string: Subdomains which must be between 4 and 20 alphanumeric characters.
// @param string: browser which browserSync open
module.exports = {
  'opt': {
    'cssBase'      : 'foundation',
    'cssBaseVer'   : 'latest',
    '_s'           : false,
    'proxy'        : '192.168.33.10',
    'tunnel'       : false,
    'bs'           : {
      'browser'    : 'google chrome canary',
      'ghostMode'  : {
        'clicks'     : false,
        'scroll'     : false
      }
    }
  },
  // basic locations
  'paths': {
    'root'         : './',
    'srcDir'       : 'src/',
    'srcImg'       : 'src/images/',
    'srcJade'      : 'src/jade/',
    'srcJs'        : 'src/js/',
    'srcJson'      : './src/json/',
    'srcScss'      : 'src/scss/',
    'destDir'      : './assets/',
    'destImg'      : './assets/images/',
    'destCss'      : './assets/css/',
    'destJs'       : './assets/js/',
    'htmlDir'      : './',
    'reloadOnly'   : ['**/*.php']
  },
  'nodeSassConf': {
    'includePaths'   : []
  }
}
