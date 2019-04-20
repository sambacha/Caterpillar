"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRoleTaskContract = void 0;

var fs = _interopRequireWildcard(require("fs"));

var path = _interopRequireWildcard(require("path"));

var ejs = _interopRequireWildcard(require("ejs"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const procesRole2solEJS = fs.readFileSync(path.join(__dirname, "../../../../templates") + "/procesRole2sol.ejs", "utf-8");
const procesRole2ArrsolEJS = fs.readFileSync(path.join(__dirname, "../../../../templates") + "/processRole2solArray.ejs", "utf-8");
let procesRole2solTemplate = ejs.compile(procesRole2solEJS);
let procesRole2solArrTemplate = ejs.compile(procesRole2ArrsolEJS);

let generateRoleTaskContract = (processData, contractName, isArray) => {
  return new Promise((resolve, reject) => {
    try {
      /////////////////////////////////////////////
      ///     SMART CONTRACT GENERATION        ///
      let sortedMaping = new Map();

      if (isArray) {
        for (let [key, indexes] of processData) {
          let maxTaskInd = 0;
          indexes.forEach(index => {
            maxTaskInd = index.taskIndex > maxTaskInd ? index.taskIndex : maxTaskInd;
          });
          let sorted = new Array();

          for (let i = 0; i <= maxTaskInd; i++) {
            let toPush = 0;
            indexes.forEach(index => {
              if (index.taskIndex === i) toPush = index.roleIndex;
            });
            sorted.push(toPush);
          }

          sortedMaping.set(key, sorted);
        }
      } else {
        sortedMaping = processData;
      }

      let codeGenerationInfo = {
        contractName: contractName,
        processData: sortedMaping
      };
      let policySolidity = isArray ? procesRole2solArrTemplate(codeGenerationInfo) : procesRole2solTemplate(codeGenerationInfo);
      resolve(policySolidity);
    } catch (ex) {
      console.log('Error: ', ex);
      reject('Error on the contract creation');
    }
  });
};

exports.generateRoleTaskContract = generateRoleTaskContract;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vcG9saWN5L2R5bmFtaWNfYmluZGluZy92YWxpZGF0aW9uX2NvZGVfZ2VuL1Byb2Nlc3NSb2xlR2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbInByb2Nlc1JvbGUyc29sRUpTIiwiZnMiLCJyZWFkRmlsZVN5bmMiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsInByb2Nlc1JvbGUyQXJyc29sRUpTIiwicHJvY2VzUm9sZTJzb2xUZW1wbGF0ZSIsImVqcyIsImNvbXBpbGUiLCJwcm9jZXNSb2xlMnNvbEFyclRlbXBsYXRlIiwiZ2VuZXJhdGVSb2xlVGFza0NvbnRyYWN0IiwicHJvY2Vzc0RhdGEiLCJjb250cmFjdE5hbWUiLCJpc0FycmF5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzb3J0ZWRNYXBpbmciLCJNYXAiLCJrZXkiLCJpbmRleGVzIiwibWF4VGFza0luZCIsImZvckVhY2giLCJpbmRleCIsInRhc2tJbmRleCIsInNvcnRlZCIsIkFycmF5IiwiaSIsInRvUHVzaCIsInJvbGVJbmRleCIsInB1c2giLCJzZXQiLCJjb2RlR2VuZXJhdGlvbkluZm8iLCJwb2xpY3lTb2xpZGl0eSIsImV4IiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O0FBRUEsTUFBTUEsaUJBQWlCLEdBQUdDLEVBQUUsQ0FBQ0MsWUFBSCxDQUN0QkMsSUFBSSxDQUFDQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsdUJBQXJCLElBQWdELHFCQUQxQixFQUV0QixPQUZzQixDQUExQjtBQUtBLE1BQU1DLG9CQUFvQixHQUFHTCxFQUFFLENBQUNDLFlBQUgsQ0FDekJDLElBQUksQ0FBQ0MsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLHVCQUFyQixJQUFnRCwyQkFEdkIsRUFFekIsT0FGeUIsQ0FBN0I7QUFLQSxJQUFJRSxzQkFBc0IsR0FBR0MsR0FBRyxDQUFDQyxPQUFKLENBQVlULGlCQUFaLENBQTdCO0FBQ0EsSUFBSVUseUJBQXlCLEdBQUdGLEdBQUcsQ0FBQ0MsT0FBSixDQUFZSCxvQkFBWixDQUFoQzs7QUFFTyxJQUFJSyx3QkFBd0IsR0FBRyxDQUFDQyxXQUFELEVBQXVDQyxZQUF2QyxFQUE2REMsT0FBN0QsS0FBbUY7QUFDckgsU0FBTyxJQUFJQyxPQUFKLENBQW9CLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUM1QyxRQUFJO0FBQ0E7QUFDQTtBQUdBLFVBQUlDLFlBQXdDLEdBQUcsSUFBSUMsR0FBSixFQUEvQzs7QUFDQSxVQUFHTCxPQUFILEVBQVk7QUFDUixhQUFLLElBQUksQ0FBQ00sR0FBRCxFQUFNQyxPQUFOLENBQVQsSUFBMkJULFdBQTNCLEVBQXdDO0FBQ3BDLGNBQUlVLFVBQVUsR0FBRyxDQUFqQjtBQUNBRCxVQUFBQSxPQUFPLENBQUNFLE9BQVIsQ0FBaUJDLEtBQUssSUFBSTtBQUN0QkYsWUFBQUEsVUFBVSxHQUFHRSxLQUFLLENBQUNDLFNBQU4sR0FBa0JILFVBQWxCLEdBQStCRSxLQUFLLENBQUNDLFNBQXJDLEdBQWlESCxVQUE5RDtBQUNILFdBRkQ7QUFHQSxjQUFJSSxNQUFxQixHQUFHLElBQUlDLEtBQUosRUFBNUI7O0FBQ0EsZUFBSSxJQUFJQyxDQUFDLEdBQUcsQ0FBWixFQUFlQSxDQUFDLElBQUlOLFVBQXBCLEVBQWdDTSxDQUFDLEVBQWpDLEVBQXFDO0FBQ2pDLGdCQUFJQyxNQUFNLEdBQUcsQ0FBYjtBQUNBUixZQUFBQSxPQUFPLENBQUNFLE9BQVIsQ0FBaUJDLEtBQUssSUFBSTtBQUN0QixrQkFBR0EsS0FBSyxDQUFDQyxTQUFOLEtBQW9CRyxDQUF2QixFQUNJQyxNQUFNLEdBQUdMLEtBQUssQ0FBQ00sU0FBZjtBQUNQLGFBSEQ7QUFJQUosWUFBQUEsTUFBTSxDQUFDSyxJQUFQLENBQVlGLE1BQVo7QUFDSDs7QUFDRFgsVUFBQUEsWUFBWSxDQUFDYyxHQUFiLENBQWlCWixHQUFqQixFQUFzQk0sTUFBdEI7QUFDSDtBQUNKLE9BakJELE1BaUJPO0FBQ0hSLFFBQUFBLFlBQVksR0FBR04sV0FBZjtBQUNIOztBQUVELFVBQUlxQixrQkFBa0IsR0FBRztBQUNyQnBCLFFBQUFBLFlBQVksRUFBRUEsWUFETztBQUVyQkQsUUFBQUEsV0FBVyxFQUFFTTtBQUZRLE9BQXpCO0FBSUEsVUFBSWdCLGNBQWMsR0FBR3BCLE9BQU8sR0FBR0oseUJBQXlCLENBQUN1QixrQkFBRCxDQUE1QixHQUFtRDFCLHNCQUFzQixDQUFDMEIsa0JBQUQsQ0FBckc7QUFDQWpCLE1BQUFBLE9BQU8sQ0FBQ2tCLGNBQUQsQ0FBUDtBQUNILEtBakNELENBaUNFLE9BQU1DLEVBQU4sRUFBVTtBQUNSQyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxTQUFaLEVBQXVCRixFQUF2QjtBQUNBbEIsTUFBQUEsTUFBTSxDQUFDLGdDQUFELENBQU47QUFDSDtBQUNKLEdBdENNLENBQVA7QUF1Q0gsQ0F4Q00iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCAqIGFzIGVqcyBmcm9tIFwiZWpzXCI7XG5cbmNvbnN0IHByb2Nlc1JvbGUyc29sRUpTID0gZnMucmVhZEZpbGVTeW5jKFxuICAgIHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vdGVtcGxhdGVzXCIpICsgXCIvcHJvY2VzUm9sZTJzb2wuZWpzXCIsXG4gICAgXCJ1dGYtOFwiXG4pO1xuXG5jb25zdCBwcm9jZXNSb2xlMkFycnNvbEVKUyA9IGZzLnJlYWRGaWxlU3luYyhcbiAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL3RlbXBsYXRlc1wiKSArIFwiL3Byb2Nlc3NSb2xlMnNvbEFycmF5LmVqc1wiLFxuICAgIFwidXRmLThcIlxuKTtcblxubGV0IHByb2Nlc1JvbGUyc29sVGVtcGxhdGUgPSBlanMuY29tcGlsZShwcm9jZXNSb2xlMnNvbEVKUyk7XG5sZXQgcHJvY2VzUm9sZTJzb2xBcnJUZW1wbGF0ZSA9IGVqcy5jb21waWxlKHByb2Nlc1JvbGUyQXJyc29sRUpTKTtcblxuZXhwb3J0IGxldCBnZW5lcmF0ZVJvbGVUYXNrQ29udHJhY3QgPSAocHJvY2Vzc0RhdGE6IE1hcDxzdHJpbmcsIEFycmF5PGFueT4+LCBjb250cmFjdE5hbWU6IHN0cmluZywgaXNBcnJheTogYm9vbGVhbikgID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vLyAgICAgU01BUlQgQ09OVFJBQ1QgR0VORVJBVElPTiAgICAgICAgLy8vXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICBsZXQgc29ydGVkTWFwaW5nOiBNYXA8c3RyaW5nLCBBcnJheTxudW1iZXI+PiA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGlmKGlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBba2V5LCBpbmRleGVzXSBvZiBwcm9jZXNzRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWF4VGFza0luZCA9IDA7ICBcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhlcy5mb3JFYWNoKCBpbmRleCA9PiB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4VGFza0luZCA9IGluZGV4LnRhc2tJbmRleCA+IG1heFRhc2tJbmQgPyBpbmRleC50YXNrSW5kZXggOiBtYXhUYXNrSW5kOyBcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNvcnRlZDogQXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheSgpO1xuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDw9IG1heFRhc2tJbmQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRvUHVzaCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleGVzLmZvckVhY2goIGluZGV4ID0+IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoaW5kZXgudGFza0luZGV4ID09PSBpKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9QdXNoID0gaW5kZXgucm9sZUluZGV4OyBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0ZWQucHVzaCh0b1B1c2gpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNvcnRlZE1hcGluZy5zZXQoa2V5LCBzb3J0ZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc29ydGVkTWFwaW5nID0gcHJvY2Vzc0RhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjb2RlR2VuZXJhdGlvbkluZm8gPSB7XG4gICAgICAgICAgICAgICAgY29udHJhY3ROYW1lOiBjb250cmFjdE5hbWUsXG4gICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IHNvcnRlZE1hcGluZ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHBvbGljeVNvbGlkaXR5ID0gaXNBcnJheSA/IHByb2Nlc1JvbGUyc29sQXJyVGVtcGxhdGUoY29kZUdlbmVyYXRpb25JbmZvKSA6IHByb2Nlc1JvbGUyc29sVGVtcGxhdGUoY29kZUdlbmVyYXRpb25JbmZvKTtcbiAgICAgICAgICAgIHJlc29sdmUocG9saWN5U29saWRpdHkpO1xuICAgICAgICB9IGNhdGNoKGV4KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6ICcsIGV4KTtcbiAgICAgICAgICAgIHJlamVjdCgnRXJyb3Igb24gdGhlIGNvbnRyYWN0IGNyZWF0aW9uJyk7XG4gICAgICAgIH1cbiAgICB9KVxufVxuXG4iXX0=