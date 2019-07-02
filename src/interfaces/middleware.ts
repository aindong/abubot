interface Middleware {
  [x: string]: { 
      defaults: any; 
      load: any;
  };
};

export default Middleware;