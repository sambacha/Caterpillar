"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _debug = _interopRequireDefault(require("debug"));

var _repo = require("../repo");

var _registryContract = _interopRequireDefault(require("../util/registry-contract"));

var _hexToId = _interopRequireDefault(require("../util/hex-to-id"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var web3, address, contract, models, children;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            web3 = _ref.web3, address = _ref.registry;
            _context.next = 3;
            return (0, _registryContract["default"])({
              address: address,
              web3: web3
            });

          case 3:
            contract = _context.sent;

            if (!contract) {
              _context.next = 13;
              break;
            }

            _context.next = 7;
            return _repo.process.find({
              'bpmnModel': {
                $ne: 'empty'
              }
            });

          case 7:
            models = _context.sent;
            _context.next = 10;
            return Promise.all(models.map(function (_ref3) {
              var _id = _ref3._id;
              (0, _debug["default"])('caterpillarql:registry.models')('_id', {
                _id: _id,
                is: web3.utils.fromAscii(_id.toString())
              });
              return contract.methods.childrenFor(web3.utils.fromAscii(_id.toString()), 0).call().then(function (x) {
                return x && (0, _hexToId["default"])(web3)(x) === _id.toString() && _id.toString();
              });
            }));

          case 10:
            children = _context.sent;
            (0, _debug["default"])('caterpillarql:registry.models')('filtered-children', {
              children: children
            });
            return _context.abrupt("return", models.filter(function (_ref4) {
              var _id = _ref4._id;
              return children.includes(_id.toString());
            }).map(function (_ref5) {
              var _id = _ref5._id,
                  name = _ref5.rootProcessName,
                  bpmn = _ref5.bpmnModel,
                  solidity = _ref5.solidityCode;
              return {
                id: _id.toString(),
                name: name,
                bpmn: bpmn,
                solidity: solidity
              };
            }));

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcmVnaXN0cnkvbW9kZWxzLnRzIl0sIm5hbWVzIjpbIndlYjMiLCJhZGRyZXNzIiwicmVnaXN0cnkiLCJjb250cmFjdCIsInByb2Nlc3MiLCJmaW5kIiwiJG5lIiwibW9kZWxzIiwiUHJvbWlzZSIsImFsbCIsIm1hcCIsIl9pZCIsImlzIiwidXRpbHMiLCJmcm9tQXNjaWkiLCJ0b1N0cmluZyIsIm1ldGhvZHMiLCJjaGlsZHJlbkZvciIsImNhbGwiLCJ0aGVuIiwieCIsImNoaWxkcmVuIiwiZmlsdGVyIiwiaW5jbHVkZXMiLCJuYW1lIiwicm9vdFByb2Nlc3NOYW1lIiwiYnBtbiIsImJwbW5Nb2RlbCIsInNvbGlkaXR5Iiwic29saWRpdHlDb2RlIiwiaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7OzswQkFFZTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDYkEsWUFBQUEsSUFEYSxRQUNiQSxJQURhLEVBRUhDLE9BRkcsUUFFYkMsUUFGYTtBQUFBO0FBQUEsbUJBSVUsa0NBQWlCO0FBQ3RDRCxjQUFBQSxPQUFPLEVBQVBBLE9BRHNDO0FBRXRDRCxjQUFBQSxJQUFJLEVBQUpBO0FBRnNDLGFBQWpCLENBSlY7O0FBQUE7QUFJUEcsWUFBQUEsUUFKTzs7QUFBQSxpQkFRVEEsUUFSUztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLG1CQVNpQkMsY0FDekJDLElBRHlCLENBQ3BCO0FBQUUsMkJBQWE7QUFBRUMsZ0JBQUFBLEdBQUcsRUFBRTtBQUFQO0FBQWYsYUFEb0IsQ0FUakI7O0FBQUE7QUFTTEMsWUFBQUEsTUFUSztBQUFBO0FBQUEsbUJBWVlDLE9BQU8sQ0FBQ0MsR0FBUixDQUNyQkYsTUFBTSxDQUNIRyxHQURILENBRUksaUJBQThCO0FBQUEsa0JBQTNCQyxHQUEyQixTQUEzQkEsR0FBMkI7QUFDNUIscUNBQU0sK0JBQU4sRUFBdUMsS0FBdkMsRUFBNkM7QUFBRUEsZ0JBQUFBLEdBQUcsRUFBSEEsR0FBRjtBQUFPQyxnQkFBQUEsRUFBRSxFQUFFWixJQUFJLENBQUNhLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQkgsR0FBRyxDQUFDSSxRQUFKLEVBQXJCO0FBQVgsZUFBN0M7QUFDQSxxQkFBT1osUUFBUSxDQUNaYSxPQURJLENBRUpDLFdBRkksQ0FFUWpCLElBQUksQ0FBQ2EsS0FBTCxDQUFXQyxTQUFYLENBQXFCSCxHQUFHLENBQUNJLFFBQUosRUFBckIsQ0FGUixFQUU4QyxDQUY5QyxFQUdKRyxJQUhJLEdBSUpDLElBSkksQ0FLSCxVQUFDQyxDQUFEO0FBQUEsdUJBQ0VBLENBQUMsSUFDRCx5QkFBUXBCLElBQVIsRUFBY29CLENBQWQsTUFBcUJULEdBQUcsQ0FBQ0ksUUFBSixFQURyQixJQUVFSixHQUFHLENBQUNJLFFBQUosRUFISjtBQUFBLGVBTEcsQ0FBUDtBQVVELGFBZEwsQ0FEcUIsQ0FaWjs7QUFBQTtBQVlMTSxZQUFBQSxRQVpLO0FBOEJYLG1DQUFNLCtCQUFOLEVBQXVDLG1CQUF2QyxFQUE0RDtBQUFFQSxjQUFBQSxRQUFRLEVBQVJBO0FBQUYsYUFBNUQ7QUE5QlcsNkNBK0JKZCxNQUFNLENBQ1ZlLE1BREksQ0FFSDtBQUFBLGtCQUNFWCxHQURGLFNBQ0VBLEdBREY7QUFBQSxxQkFFZVUsUUFBUSxDQUFDRSxRQUFULENBQWtCWixHQUFHLENBQUNJLFFBQUosRUFBbEIsQ0FGZjtBQUFBLGFBRkcsRUFNSkwsR0FOSSxDQU9IO0FBQUEsa0JBQ0VDLEdBREYsU0FDRUEsR0FERjtBQUFBLGtCQUVtQmEsSUFGbkIsU0FFRUMsZUFGRjtBQUFBLGtCQUdhQyxJQUhiLFNBR0VDLFNBSEY7QUFBQSxrQkFJZ0JDLFFBSmhCLFNBSUVDLFlBSkY7QUFBQSxxQkFLZTtBQUNiQyxnQkFBQUEsRUFBRSxFQUFFbkIsR0FBRyxDQUFDSSxRQUFKLEVBRFM7QUFFYlMsZ0JBQUFBLElBQUksRUFBSkEsSUFGYTtBQUdiRSxnQkFBQUEsSUFBSSxFQUFKQSxJQUhhO0FBSWJFLGdCQUFBQSxRQUFRLEVBQVJBO0FBSmEsZUFMZjtBQUFBLGFBUEcsQ0EvQkk7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCB7IHByb2Nlc3MsIHJlZ2lzdHJ5IH0gZnJvbSAnLi4vcmVwbydcbmltcG9ydCByZWdpc3RyeUNvbnRyYWN0IGZyb20gJy4uL3V0aWwvcmVnaXN0cnktY29udHJhY3QnXG5pbXBvcnQgaGV4VG9JZCBmcm9tICcuLi91dGlsL2hleC10by1pZCdcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHtcbiAgd2ViMyxcbiAgcmVnaXN0cnk6IGFkZHJlc3MsXG59KTogUHJvbWlzZTxhbnlbXT4gPT4ge1xuICBjb25zdCBjb250cmFjdCA9IGF3YWl0IHJlZ2lzdHJ5Q29udHJhY3Qoe1xuICAgIGFkZHJlc3MsXG4gICAgd2ViMyxcbiAgfSlcbiAgaWYgKGNvbnRyYWN0KSB7XG4gICAgY29uc3QgbW9kZWxzOiBhbnlbXSA9IGF3YWl0IHByb2Nlc3NcbiAgICAgIC5maW5kKHsgJ2JwbW5Nb2RlbCc6IHsgJG5lOiAnZW1wdHknIH0gfSlcbiAgICBcbiAgICBjb25zdCBjaGlsZHJlbiA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgbW9kZWxzXG4gICAgICAgIC5tYXAoXG4gICAgICAgICAgKHsgX2lkIH0pOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgICAgICAgICAgZGVidWcoJ2NhdGVycGlsbGFycWw6cmVnaXN0cnkubW9kZWxzJykoJ19pZCcseyBfaWQsIGlzOiB3ZWIzLnV0aWxzLmZyb21Bc2NpaShfaWQudG9TdHJpbmcoKSkgfSlcbiAgICAgICAgICAgIHJldHVybiBjb250cmFjdFxuICAgICAgICAgICAgICAubWV0aG9kc1xuICAgICAgICAgICAgICAuY2hpbGRyZW5Gb3Iod2ViMy51dGlscy5mcm9tQXNjaWkoX2lkLnRvU3RyaW5nKCkpLCAwKVxuICAgICAgICAgICAgICAuY2FsbCgpXG4gICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICh4KTogc3RyaW5nID0+XG4gICAgICAgICAgICAgICAgICB4ICYmXG4gICAgICAgICAgICAgICAgICBoZXhUb0lkKHdlYjMpKHgpID09PSBfaWQudG9TdHJpbmcoKSAmJlxuICAgICAgICAgICAgICAgICAgICBfaWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgIH0sXG4gICAgICAgIClcbiAgICApXG4gICAgZGVidWcoJ2NhdGVycGlsbGFycWw6cmVnaXN0cnkubW9kZWxzJykoJ2ZpbHRlcmVkLWNoaWxkcmVuJywgeyBjaGlsZHJlbiAgfSlcbiAgICByZXR1cm4gbW9kZWxzXG4gICAgICAuZmlsdGVyKFxuICAgICAgICAoe1xuICAgICAgICAgIF9pZCxcbiAgICAgICAgfSk6IGJvb2xlYW4gPT4gY2hpbGRyZW4uaW5jbHVkZXMoX2lkLnRvU3RyaW5nKCkpXG4gICAgICApXG4gICAgICAubWFwKFxuICAgICAgICAoe1xuICAgICAgICAgIF9pZCxcbiAgICAgICAgICByb290UHJvY2Vzc05hbWU6IG5hbWUsXG4gICAgICAgICAgYnBtbk1vZGVsOiBicG1uLFxuICAgICAgICAgIHNvbGlkaXR5Q29kZTogc29saWRpdHksXG4gICAgICAgIH0pOiBvYmplY3QgPT4gKHtcbiAgICAgICAgICBpZDogX2lkLnRvU3RyaW5nKCksXG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICBicG1uLFxuICAgICAgICAgIHNvbGlkaXR5XG4gICAgICAgIH0pXG4gICAgICApXG4gIH1cbn1cbiJdfQ==