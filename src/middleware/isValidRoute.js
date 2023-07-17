function isValidRoute(req, res, next) {
  let counter = 0;
  let routes = [];
  let isValid = false;

  req.app._router.stack.forEach((middleware) => {
    if (middleware.regexp) {
      let regexp = middleware.regexp.toString();
      regexp = regexp.slice(3);
      const index = regexp.indexOf("/?(");
      regexp = regexp.slice(0, index - 1);

      if (middleware.route) {
        routes.push({ child: middleware.route.path, parent: regexp });
        if (middleware.route.path === req.path) {
          isValid = true;
        }
      } else if (middleware.name === "router") {
        middleware.handle.stack.forEach(function (handler) {
          counter++;

          if (counter % 2 === 1) {
            return;
          }

          route = handler.route;
          if (route && route.path === req.path) {
            isValid = true;
          }

          route && routes.push({ child: route.path, parent: regexp });
        });
      }

      routes.push({ regexp });
    }
  });

  if (isValid) {
    next();
  } else {
    res.redirect("/");
  }
}

module.exports = isValidRoute;
