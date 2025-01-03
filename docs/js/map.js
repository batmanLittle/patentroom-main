//карта
$(document).ready(function () {
  ymaps.ready(init);

  function init() {
    const map = new ymaps.Map("map", {
      center: [55.7158, 37.7911],
      zoom: 15,
      controls: ["zoomControl", "geolocationControl"],
    });

    const svgMarker = `
   <svg  class="custom-svg" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M58.7336 23.1666C55.2336 7.76658 41.8003 0.833252 30.0003 0.833252C30.0003 0.833252 30.0003 0.833252 29.967 0.833252C18.2003 0.833252 4.73365 7.73325 1.23365 23.1332C-2.66635 40.3332 7.86699 54.8999 17.4003 64.0666C20.9336 67.4666 25.467 69.1666 30.0003 69.1666C34.5336 69.1666 39.067 67.4666 42.567 64.0666C52.1003 54.8999 62.6336 40.3666 58.7336 23.1666ZM30.0003 39.8666C24.2003 39.8666 19.5003 35.1666 19.5003 29.3666C19.5003 23.5666 24.2003 18.8666 30.0003 18.8666C35.8003 18.8666 40.5003 23.5666 40.5003 29.3666C40.5003 35.1666 35.8003 39.8666 30.0003 39.8666Z" fill="#4EBDF5"/>
   </svg>
  `;

    map.panes.get("ground").getElement().style.filter = "grayscale(100%)";

    const customPlacemark = new ymaps.Placemark(
      [55.7158, 37.7911],
      {
        balloonContent:
          "<b>Москва</b><br>Рязанский проспект 75, корп. 4, этаж 12",
      },
      {
        iconLayout: "default#imageWithContent",
        iconContentLayout: ymaps.templateLayoutFactory.createClass(svgMarker),
        iconImageSize: [0, 0],
      }
    );

    map.geoObjects.add(customPlacemark);
  }
});
