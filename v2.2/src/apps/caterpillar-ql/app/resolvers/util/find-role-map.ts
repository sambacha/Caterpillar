export default (repoArr) => {
  let roleIndexMap: Map<string, number> = new Map();
  for (let i = 1; i < repoArr.length; i++)
      if(repoArr[i]) 
          roleIndexMap.set(repoArr[i], i);
  return roleIndexMap;    
}