export default class Marker {
  constructor(color, caption) {
    this.className = "custom__icon";
    this.iconSize = [25, 25];
    this.html = `
        <div class="marker__container">
        <div class="icon__container" style="background-color:${color}">
       <img src='./camera1.png' style="width:80%; height:80%, object-fit:cover"/>
       </div>
        <div class="captions__container">
          <div class="marker__caption">${caption}</div>
        </div>
        </div>`;
    this.prefix = "fa";
  }
}
