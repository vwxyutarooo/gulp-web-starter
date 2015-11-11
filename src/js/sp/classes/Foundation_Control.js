export default class Offcanvas_Control {

  /*
   * Constructor
   */
  constructor() {
    this.init();
  }


  /*
   * Initialize
   */
  init() {
    const _this = this;

    if(typeof $.prototype.foundation !== 'function') return;
    $(document).foundation();
  }


}
