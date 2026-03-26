const sessionStates=new Map();

exports.getSessionState=(id)=>sessionStates.get(id);

exports.setSessionState=(id,state)=>{
  sessionStates.set(id,state);
};

exports.clearSessionState=(id)=>{
  sessionStates.delete(id);
};