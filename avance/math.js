// Define el nombre de la variable a exportar
export const math = (function() {
  return {

    // Regresa un número aleatorio entre a y b
    rand_range: function(a, b) {
      return Math.random() * (b - a) + a;
    },

    // regresa un número entero aleatorio entre a y b
    rand_int: function(a, b) {
      return Math.round(Math.random() * (b - a) + a);
    },

  };
})();
