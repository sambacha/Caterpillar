"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Task_idContext = exports.Role_idContext = exports.Subprocess_idContext = exports.Role_path_expresionContext = exports.RoleContext = exports.NomineeContext = exports.NominatorContext = exports.Scope_restrictionContext = exports.Set_expresionContext = exports.Endorsement_constrContext = exports.Binding_constrContext = exports.Is_creatorContext = exports.Unbinding_statementContext = exports.Binding_statementContext = exports.Unbinding_setContext = exports.Binding_setContext = exports.Binding_policyContext = exports.binding_grammarParser = void 0;

var _ATN = require("antlr4ts/atn/ATN");

var _ATNDeserializer = require("antlr4ts/atn/ATNDeserializer");

var _Decorators = require("antlr4ts/Decorators");

var _NoViableAltException = require("antlr4ts/NoViableAltException");

var _Parser = require("antlr4ts/Parser");

var _ParserRuleContext = require("antlr4ts/ParserRuleContext");

var _ParserATNSimulator = require("antlr4ts/atn/ParserATNSimulator");

var _RecognitionException = require("antlr4ts/RecognitionException");

var _RuleVersion = require("antlr4ts/RuleVersion");

var _VocabularyImpl = require("antlr4ts/VocabularyImpl");

var Utils = _interopRequireWildcard(require("antlr4ts/misc/Utils"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _class, _class2, _temp, _class3, _class4, _class5, _class6, _class7, _class8, _class9, _class10, _class11, _class12, _class13, _class14, _class15, _class16, _class17, _class18, _class19;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

const LITERAL_NAMES = [undefined, "'nominates'", "'releases'", "'self'", undefined, "'case-creator'", "'and'", "'or'", "'is'", "'in'", "'not'", "'Under'", "','", "'.'", "';'", "'('", "')'", "'{'", "'}'"];
const SYMBOLIC_NAMES = [undefined, "NOMINATES", "RELEASES", "SELF", "ENDORSED_BY", "CASE_CREATOR", "AND", "OR", "IS", "IN", "NOT", "UNDER", "COMMA", "DOT", "SEMICOLON", "LPAREN", "RPAREN", "LBRACES", "RBRACES", "IDENTIFIER", "WS"];
let binding_grammarParser = (_dec = (0, _RuleVersion.RuleVersion)(0), _dec2 = (0, _RuleVersion.RuleVersion)(0), _dec3 = (0, _RuleVersion.RuleVersion)(0), _dec4 = (0, _RuleVersion.RuleVersion)(0), _dec5 = (0, _RuleVersion.RuleVersion)(0), _dec6 = (0, _RuleVersion.RuleVersion)(0), _dec7 = (0, _RuleVersion.RuleVersion)(0), _dec8 = (0, _RuleVersion.RuleVersion)(0), _dec9 = (0, _RuleVersion.RuleVersion)(0), _dec10 = (0, _RuleVersion.RuleVersion)(0), _dec11 = (0, _RuleVersion.RuleVersion)(0), _dec12 = (0, _RuleVersion.RuleVersion)(0), _dec13 = (0, _RuleVersion.RuleVersion)(0), _dec14 = (0, _RuleVersion.RuleVersion)(0), _dec15 = (0, _RuleVersion.RuleVersion)(0), _dec16 = (0, _RuleVersion.RuleVersion)(0), _dec17 = (0, _RuleVersion.RuleVersion)(0), (_class = (_temp = _class2 = class binding_grammarParser extends _Parser.Parser {
  get vocabulary() {
    return binding_grammarParser.VOCABULARY;
  }

  get grammarFileName() {
    return "binding_grammar.g4";
  }

  get ruleNames() {
    return binding_grammarParser.ruleNames;
  }

  get serializedATN() {
    return binding_grammarParser._serializedATN;
  }

  constructor(input) {
    super(input);
    this._interp = new _ParserATNSimulator.ParserATNSimulator(binding_grammarParser._ATN, this);
  }

  binding_policy() {
    let _localctx = new Binding_policyContext(this._ctx, this.state);

    this.enterRule(_localctx, 0, binding_grammarParser.RULE_binding_policy);

    try {
      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 34;
        this.binding_set();
        this.state = 35;
        this.unbinding_set();
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  binding_set() {
    let _localctx = new Binding_setContext(this._ctx, this.state);

    this.enterRule(_localctx, 2, binding_grammarParser.RULE_binding_set);

    let _la;

    try {
      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 37;
        this.match(binding_grammarParser.LBRACES);
        this.state = 38;
        this.binding_statement();
        this.state = 43;

        this._errHandler.sync(this);

        _la = this._input.LA(1);

        while (_la === binding_grammarParser.SEMICOLON) {
          {
            {
              this.state = 39;
              this.match(binding_grammarParser.SEMICOLON);
              this.state = 40;
              this.binding_statement();
            }
          }
          this.state = 45;

          this._errHandler.sync(this);

          _la = this._input.LA(1);
        }

        this.state = 46;
        this.match(binding_grammarParser.RBRACES);
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  unbinding_set() {
    let _localctx = new Unbinding_setContext(this._ctx, this.state);

    this.enterRule(_localctx, 4, binding_grammarParser.RULE_unbinding_set);

    let _la;

    try {
      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 48;
        this.match(binding_grammarParser.LBRACES);
        this.state = 58;

        this._errHandler.sync(this);

        switch (this._input.LA(1)) {
          case binding_grammarParser.SELF:
          case binding_grammarParser.IDENTIFIER:
            {
              this.state = 49;
              this.unbinding_statement();
              this.state = 54;

              this._errHandler.sync(this);

              _la = this._input.LA(1);

              while (_la === binding_grammarParser.SEMICOLON) {
                {
                  {
                    this.state = 50;
                    this.match(binding_grammarParser.SEMICOLON);
                    this.state = 51;
                    this.unbinding_statement();
                  }
                }
                this.state = 56;

                this._errHandler.sync(this);

                _la = this._input.LA(1);
              }
            }
            break;

          case binding_grammarParser.RBRACES:
            {}
            break;

          default:
            throw new _NoViableAltException.NoViableAltException(this);
        }

        this.state = 60;
        this.match(binding_grammarParser.RBRACES);
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  binding_statement() {
    let _localctx = new Binding_statementContext(this._ctx, this.state);

    this.enterRule(_localctx, 6, binding_grammarParser.RULE_binding_statement);

    let _la;

    try {
      this.state = 75;

      this._errHandler.sync(this);

      switch (this.interpreter.adaptivePredict(this._input, 6, this._ctx)) {
        case 1:
          this.enterOuterAlt(_localctx, 1);
          {
            this.state = 62;
            this.is_creator();
          }
          break;

        case 2:
          this.enterOuterAlt(_localctx, 2);
          {
            this.state = 64;

            this._errHandler.sync(this);

            _la = this._input.LA(1);

            if (_la === binding_grammarParser.UNDER) {
              {
                this.state = 63;
                this.scope_restriction();
              }
            }

            this.state = 66;
            this.nominator();
            this.state = 67;
            this.match(binding_grammarParser.NOMINATES);
            this.state = 68;
            this.nominee();
            this.state = 70;

            this._errHandler.sync(this);

            _la = this._input.LA(1);

            if (_la === binding_grammarParser.IN || _la === binding_grammarParser.NOT) {
              {
                this.state = 69;
                this.binding_constr();
              }
            }

            this.state = 73;

            this._errHandler.sync(this);

            _la = this._input.LA(1);

            if (_la === binding_grammarParser.ENDORSED_BY) {
              {
                this.state = 72;
                this.endorsement_constr();
              }
            }
          }
          break;
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  unbinding_statement() {
    let _localctx = new Unbinding_statementContext(this._ctx, this.state);

    this.enterRule(_localctx, 8, binding_grammarParser.RULE_unbinding_statement);

    let _la;

    try {
      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 77;
        this.nominator();
        this.state = 78;
        this.match(binding_grammarParser.RELEASES);
        this.state = 79;
        this.nominee();
        this.state = 81;

        this._errHandler.sync(this);

        _la = this._input.LA(1);

        if (_la === binding_grammarParser.IN || _la === binding_grammarParser.NOT) {
          {
            this.state = 80;
            this.binding_constr();
          }
        }

        this.state = 84;

        this._errHandler.sync(this);

        _la = this._input.LA(1);

        if (_la === binding_grammarParser.ENDORSED_BY) {
          {
            this.state = 83;
            this.endorsement_constr();
          }
        }
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  is_creator() {
    let _localctx = new Is_creatorContext(this._ctx, this.state);

    this.enterRule(_localctx, 10, binding_grammarParser.RULE_is_creator);

    try {
      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 86;
        this.role();
        this.state = 87;
        this.match(binding_grammarParser.IS);
        this.state = 88;
        this.match(binding_grammarParser.CASE_CREATOR);
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  binding_constr() {
    let _localctx = new Binding_constrContext(this._ctx, this.state);

    this.enterRule(_localctx, 12, binding_grammarParser.RULE_binding_constr);

    try {
      this.state = 95;

      this._errHandler.sync(this);

      switch (this._input.LA(1)) {
        case binding_grammarParser.NOT:
          this.enterOuterAlt(_localctx, 1);
          {
            this.state = 90;
            this.match(binding_grammarParser.NOT);
            this.state = 91;
            this.match(binding_grammarParser.IN);
            this.state = 92;
            this.set_expresion();
          }
          break;

        case binding_grammarParser.IN:
          this.enterOuterAlt(_localctx, 2);
          {
            this.state = 93;
            this.match(binding_grammarParser.IN);
            this.state = 94;
            this.set_expresion();
          }
          break;

        default:
          throw new _NoViableAltException.NoViableAltException(this);
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  endorsement_constr() {
    let _localctx = new Endorsement_constrContext(this._ctx, this.state);

    this.enterRule(_localctx, 14, binding_grammarParser.RULE_endorsement_constr);

    try {
      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 97;
        this.match(binding_grammarParser.ENDORSED_BY);
        this.state = 98;
        this.set_expresion();
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  set_expresion() {
    let _localctx = new Set_expresionContext(this._ctx, this.state);

    this.enterRule(_localctx, 16, binding_grammarParser.RULE_set_expresion);

    try {
      this.state = 113;

      this._errHandler.sync(this);

      switch (this.interpreter.adaptivePredict(this._input, 10, this._ctx)) {
        case 1:
          this.enterOuterAlt(_localctx, 1);
          {
            this.state = 100;
            this.match(binding_grammarParser.LPAREN);
            this.state = 101;
            this.set_expresion();
            this.state = 102;
            this.match(binding_grammarParser.RPAREN);
          }
          break;

        case 2:
          this.enterOuterAlt(_localctx, 2);
          {
            this.state = 104;
            this.role();
            this.state = 105;
            this.match(binding_grammarParser.OR);
            this.state = 106;
            this.set_expresion();
          }
          break;

        case 3:
          this.enterOuterAlt(_localctx, 3);
          {
            this.state = 108;
            this.role();
            this.state = 109;
            this.match(binding_grammarParser.AND);
            this.state = 110;
            this.set_expresion();
          }
          break;

        case 4:
          this.enterOuterAlt(_localctx, 4);
          {
            this.state = 112;
            this.role();
          }
          break;
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  scope_restriction() {
    let _localctx = new Scope_restrictionContext(this._ctx, this.state);

    this.enterRule(_localctx, 18, binding_grammarParser.RULE_scope_restriction);

    try {
      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 115;
        this.match(binding_grammarParser.UNDER);
        this.state = 116;
        this.subprocess_id();
        this.state = 117;
        this.match(binding_grammarParser.COMMA);
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  nominator() {
    let _localctx = new NominatorContext(this._ctx, this.state);

    this.enterRule(_localctx, 20, binding_grammarParser.RULE_nominator);

    try {
      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 119;
        this.role();
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  nominee() {
    let _localctx = new NomineeContext(this._ctx, this.state);

    this.enterRule(_localctx, 22, binding_grammarParser.RULE_nominee);

    try {
      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 121;
        this.role();
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  role() {
    let _localctx = new RoleContext(this._ctx, this.state);

    this.enterRule(_localctx, 24, binding_grammarParser.RULE_role);

    try {
      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 126;

        this._errHandler.sync(this);

        switch (this.interpreter.adaptivePredict(this._input, 11, this._ctx)) {
          case 1:
            {
              this.state = 123;
              this.role_id();
            }
            break;

          case 2:
            {
              this.state = 124;
              this.role_path_expresion();
            }
            break;

          case 3:
            {
              this.state = 125;
              this.match(binding_grammarParser.SELF);
            }
            break;
        }
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  role_path_expresion() {
    let _localctx = new Role_path_expresionContext(this._ctx, this.state);

    this.enterRule(_localctx, 26, binding_grammarParser.RULE_role_path_expresion);

    try {
      let _alt;

      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 131;

        this._errHandler.sync(this);

        _alt = 1;

        do {
          switch (_alt) {
            case 1:
              {
                {
                  this.state = 128;
                  this.subprocess_id();
                  this.state = 129;
                  this.match(binding_grammarParser.DOT);
                }
              }
              break;

            default:
              throw new _NoViableAltException.NoViableAltException(this);
          }

          this.state = 133;

          this._errHandler.sync(this);

          _alt = this.interpreter.adaptivePredict(this._input, 12, this._ctx);
        } while (_alt !== 2 && _alt !== _ATN.ATN.INVALID_ALT_NUMBER);

        this.state = 135;
        this.role_id();
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  subprocess_id() {
    let _localctx = new Subprocess_idContext(this._ctx, this.state);

    this.enterRule(_localctx, 28, binding_grammarParser.RULE_subprocess_id);

    try {
      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 137;
        this.match(binding_grammarParser.IDENTIFIER);
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  role_id() {
    let _localctx = new Role_idContext(this._ctx, this.state);

    this.enterRule(_localctx, 30, binding_grammarParser.RULE_role_id);

    try {
      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 139;
        this.match(binding_grammarParser.IDENTIFIER);
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  task_id() {
    let _localctx = new Task_idContext(this._ctx, this.state);

    this.enterRule(_localctx, 32, binding_grammarParser.RULE_task_id);

    try {
      this.enterOuterAlt(_localctx, 1);
      {
        this.state = 141;
        this.match(binding_grammarParser.IDENTIFIER);
      }
    } catch (re) {
      if (re instanceof _RecognitionException.RecognitionException) {
        _localctx.exception = re;

        this._errHandler.reportError(this, re);

        this._errHandler.recover(this, re);
      } else {
        throw re;
      }
    } finally {
      this.exitRule();
    }

    return _localctx;
  }

  static get _ATN() {
    if (!binding_grammarParser.__ATN) {
      binding_grammarParser.__ATN = new _ATNDeserializer.ATNDeserializer().deserialize(Utils.toCharArray(binding_grammarParser._serializedATN));
    }

    return binding_grammarParser.__ATN;
  }

}, _defineProperty(_class2, "NOMINATES", 1), _defineProperty(_class2, "RELEASES", 2), _defineProperty(_class2, "SELF", 3), _defineProperty(_class2, "ENDORSED_BY", 4), _defineProperty(_class2, "CASE_CREATOR", 5), _defineProperty(_class2, "AND", 6), _defineProperty(_class2, "OR", 7), _defineProperty(_class2, "IS", 8), _defineProperty(_class2, "IN", 9), _defineProperty(_class2, "NOT", 10), _defineProperty(_class2, "UNDER", 11), _defineProperty(_class2, "COMMA", 12), _defineProperty(_class2, "DOT", 13), _defineProperty(_class2, "SEMICOLON", 14), _defineProperty(_class2, "LPAREN", 15), _defineProperty(_class2, "RPAREN", 16), _defineProperty(_class2, "LBRACES", 17), _defineProperty(_class2, "RBRACES", 18), _defineProperty(_class2, "IDENTIFIER", 19), _defineProperty(_class2, "WS", 20), _defineProperty(_class2, "RULE_binding_policy", 0), _defineProperty(_class2, "RULE_binding_set", 1), _defineProperty(_class2, "RULE_unbinding_set", 2), _defineProperty(_class2, "RULE_binding_statement", 3), _defineProperty(_class2, "RULE_unbinding_statement", 4), _defineProperty(_class2, "RULE_is_creator", 5), _defineProperty(_class2, "RULE_binding_constr", 6), _defineProperty(_class2, "RULE_endorsement_constr", 7), _defineProperty(_class2, "RULE_set_expresion", 8), _defineProperty(_class2, "RULE_scope_restriction", 9), _defineProperty(_class2, "RULE_nominator", 10), _defineProperty(_class2, "RULE_nominee", 11), _defineProperty(_class2, "RULE_role", 12), _defineProperty(_class2, "RULE_role_path_expresion", 13), _defineProperty(_class2, "RULE_subprocess_id", 14), _defineProperty(_class2, "RULE_role_id", 15), _defineProperty(_class2, "RULE_task_id", 16), _defineProperty(_class2, "ruleNames", ["binding_policy", "binding_set", "unbinding_set", "binding_statement", "unbinding_statement", "is_creator", "binding_constr", "endorsement_constr", "set_expresion", "scope_restriction", "nominator", "nominee", "role", "role_path_expresion", "subprocess_id", "role_id", "task_id"]), _defineProperty(_class2, "_LITERAL_NAMES", LITERAL_NAMES), _defineProperty(_class2, "_SYMBOLIC_NAMES", SYMBOLIC_NAMES), _defineProperty(_class2, "VOCABULARY", new _VocabularyImpl.VocabularyImpl(LITERAL_NAMES, SYMBOLIC_NAMES, [])), _defineProperty(_class2, "_serializedATN", "\x03\uAF6F\u8320\u479D\uB75C\u4880\u1605\u191C\uAB37\x03\x16\x92\x04\x02" + "\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" + "\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" + "\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x03" + "\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03\x03\x07\x03,\n\x03\f" + "\x03\x0E\x03/\v\x03\x03\x03\x03\x03\x03\x04\x03\x04\x03\x04\x03\x04\x07" + "\x047\n\x04\f\x04\x0E\x04:\v\x04\x03\x04\x05\x04=\n\x04\x03\x04\x03\x04" + "\x03\x05\x03\x05\x05\x05C\n\x05\x03\x05\x03\x05\x03\x05\x03\x05\x05\x05" + "I\n\x05\x03\x05\x05\x05L\n\x05\x05\x05N\n\x05\x03\x06\x03\x06\x03\x06" + "\x03\x06\x05\x06T\n\x06\x03\x06\x05\x06W\n\x06\x03\x07\x03\x07\x03\x07" + "\x03\x07\x03\b\x03\b\x03\b\x03\b\x03\b\x05\bb\n\b\x03\t\x03\t\x03\t\x03" + "\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03" + "\n\x05\nt\n\n\x03\v\x03\v\x03\v\x03\v\x03\f\x03\f\x03\r\x03\r\x03\x0E" + "\x03\x0E\x03\x0E\x05\x0E\x81\n\x0E\x03\x0F\x03\x0F\x03\x0F\x06\x0F\x86" + "\n\x0F\r\x0F\x0E\x0F\x87\x03\x0F\x03\x0F\x03\x10\x03\x10\x03\x11\x03\x11" + "\x03\x12\x03\x12\x03\x12\x02\x02\x02\x13\x02\x02\x04\x02\x06\x02\b\x02" + "\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C" + "\x02\x1E\x02 \x02\"\x02\x02\x02\x90\x02$\x03\x02\x02\x02\x04\'\x03\x02" + "\x02\x02\x062\x03\x02\x02\x02\bM\x03\x02\x02\x02\nO\x03\x02\x02\x02\f" + "X\x03\x02\x02\x02\x0Ea\x03\x02\x02\x02\x10c\x03\x02\x02\x02\x12s\x03\x02" + "\x02\x02\x14u\x03\x02\x02\x02\x16y\x03\x02\x02\x02\x18{\x03\x02\x02\x02" + "\x1A\x80\x03\x02\x02\x02\x1C\x85\x03\x02\x02\x02\x1E\x8B\x03\x02\x02\x02" + " \x8D\x03\x02\x02\x02\"\x8F\x03\x02\x02\x02$%\x05\x04\x03\x02%&\x05\x06" + "\x04\x02&\x03\x03\x02\x02\x02\'(\x07\x13\x02\x02(-\x05\b\x05\x02)*\x07" + "\x10\x02\x02*,\x05\b\x05\x02+)\x03\x02\x02\x02,/\x03\x02\x02\x02-+\x03" + "\x02\x02\x02-.\x03\x02\x02\x02.0\x03\x02\x02\x02/-\x03\x02\x02\x0201\x07" + "\x14\x02\x021\x05\x03\x02\x02\x022<\x07\x13\x02\x0238\x05\n\x06\x0245" + "\x07\x10\x02\x0257\x05\n\x06\x0264\x03\x02\x02\x027:\x03\x02\x02\x028" + "6\x03\x02\x02\x0289\x03\x02\x02\x029=\x03\x02\x02\x02:8\x03\x02\x02\x02" + ";=\x03\x02\x02\x02<3\x03\x02\x02\x02<;\x03\x02\x02\x02=>\x03\x02\x02\x02" + ">?\x07\x14\x02\x02?\x07\x03\x02\x02\x02@N\x05\f\x07\x02AC\x05\x14\v\x02" + "BA\x03\x02\x02\x02BC\x03\x02\x02\x02CD\x03\x02\x02\x02DE\x05\x16\f\x02" + "EF\x07\x03\x02\x02FH\x05\x18\r\x02GI\x05\x0E\b\x02HG\x03\x02\x02\x02H" + "I\x03\x02\x02\x02IK\x03\x02\x02\x02JL\x05\x10\t\x02KJ\x03\x02\x02\x02" + "KL\x03\x02\x02\x02LN\x03\x02\x02\x02M@\x03\x02\x02\x02MB\x03\x02\x02\x02" + "N\t\x03\x02\x02\x02OP\x05\x16\f\x02PQ\x07\x04\x02\x02QS\x05\x18\r\x02" + "RT\x05\x0E\b\x02SR\x03\x02\x02\x02ST\x03\x02\x02\x02TV\x03\x02\x02\x02" + "UW\x05\x10\t\x02VU\x03\x02\x02\x02VW\x03\x02\x02\x02W\v\x03\x02\x02\x02" + "XY\x05\x1A\x0E\x02YZ\x07\n\x02\x02Z[\x07\x07\x02\x02[\r\x03\x02\x02\x02" + "\\]\x07\f\x02\x02]^\x07\v\x02\x02^b\x05\x12\n\x02_`\x07\v\x02\x02`b\x05" + "\x12\n\x02a\\\x03\x02\x02\x02a_\x03\x02\x02\x02b\x0F\x03\x02\x02\x02c" + "d\x07\x06\x02\x02de\x05\x12\n\x02e\x11\x03\x02\x02\x02fg\x07\x11\x02\x02" + "gh\x05\x12\n\x02hi\x07\x12\x02\x02it\x03\x02\x02\x02jk\x05\x1A\x0E\x02" + "kl\x07\t\x02\x02lm\x05\x12\n\x02mt\x03\x02\x02\x02no\x05\x1A\x0E\x02o" + "p\x07\b\x02\x02pq\x05\x12\n\x02qt\x03\x02\x02\x02rt\x05\x1A\x0E\x02sf" + "\x03\x02\x02\x02sj\x03\x02\x02\x02sn\x03\x02\x02\x02sr\x03\x02\x02\x02" + "t\x13\x03\x02\x02\x02uv\x07\r\x02\x02vw\x05\x1E\x10\x02wx\x07\x0E\x02" + "\x02x\x15\x03\x02\x02\x02yz\x05\x1A\x0E\x02z\x17\x03\x02\x02\x02{|\x05" + "\x1A\x0E\x02|\x19\x03\x02\x02\x02}\x81\x05 \x11\x02~\x81\x05\x1C\x0F\x02" + "\x7F\x81\x07\x05\x02\x02\x80}\x03\x02\x02\x02\x80~\x03\x02\x02\x02\x80" + "\x7F\x03\x02\x02\x02\x81\x1B\x03\x02\x02\x02\x82\x83\x05\x1E\x10\x02\x83" + "\x84\x07\x0F\x02\x02\x84\x86\x03\x02\x02\x02\x85\x82\x03\x02\x02\x02\x86" + "\x87\x03\x02\x02\x02\x87\x85\x03\x02\x02\x02\x87\x88\x03\x02\x02\x02\x88" + "\x89\x03\x02\x02\x02\x89\x8A\x05 \x11\x02\x8A\x1D\x03\x02\x02\x02\x8B" + "\x8C\x07\x15\x02\x02\x8C\x1F\x03\x02\x02\x02\x8D\x8E\x07\x15\x02\x02\x8E" + "!\x03\x02\x02\x02\x8F\x90\x07\x15\x02\x02\x90#\x03\x02\x02\x02\x0F-8<" + "BHKMSVas\x80\x87"), _defineProperty(_class2, "__ATN", void 0), _temp), (_applyDecoratedDescriptor(_class.prototype, "vocabulary", [_Decorators.Override, _Decorators.NotNull], Object.getOwnPropertyDescriptor(_class.prototype, "vocabulary"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "grammarFileName", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class.prototype, "grammarFileName"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "ruleNames", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class.prototype, "ruleNames"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "serializedATN", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class.prototype, "serializedATN"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "binding_policy", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "binding_policy"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "binding_set", [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, "binding_set"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "unbinding_set", [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, "unbinding_set"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "binding_statement", [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, "binding_statement"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "unbinding_statement", [_dec5], Object.getOwnPropertyDescriptor(_class.prototype, "unbinding_statement"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "is_creator", [_dec6], Object.getOwnPropertyDescriptor(_class.prototype, "is_creator"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "binding_constr", [_dec7], Object.getOwnPropertyDescriptor(_class.prototype, "binding_constr"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "endorsement_constr", [_dec8], Object.getOwnPropertyDescriptor(_class.prototype, "endorsement_constr"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "set_expresion", [_dec9], Object.getOwnPropertyDescriptor(_class.prototype, "set_expresion"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "scope_restriction", [_dec10], Object.getOwnPropertyDescriptor(_class.prototype, "scope_restriction"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "nominator", [_dec11], Object.getOwnPropertyDescriptor(_class.prototype, "nominator"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "nominee", [_dec12], Object.getOwnPropertyDescriptor(_class.prototype, "nominee"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "role", [_dec13], Object.getOwnPropertyDescriptor(_class.prototype, "role"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "role_path_expresion", [_dec14], Object.getOwnPropertyDescriptor(_class.prototype, "role_path_expresion"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "subprocess_id", [_dec15], Object.getOwnPropertyDescriptor(_class.prototype, "subprocess_id"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "role_id", [_dec16], Object.getOwnPropertyDescriptor(_class.prototype, "role_id"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "task_id", [_dec17], Object.getOwnPropertyDescriptor(_class.prototype, "task_id"), _class.prototype)), _class));
exports.binding_grammarParser = binding_grammarParser;
let Binding_policyContext = (_class3 = class Binding_policyContext extends _ParserRuleContext.ParserRuleContext {
  binding_set() {
    return this.getRuleContext(0, Binding_setContext);
  }

  unbinding_set() {
    return this.getRuleContext(0, Unbinding_setContext);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_binding_policy;
  }

  enterRule(listener) {
    if (listener.enterBinding_policy) listener.enterBinding_policy(this);
  }

  exitRule(listener) {
    if (listener.exitBinding_policy) listener.exitBinding_policy(this);
  }

  accept(visitor) {
    if (visitor.visitBinding_policy) return visitor.visitBinding_policy(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class3.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class3.prototype, "ruleIndex"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class3.prototype, "enterRule"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class3.prototype, "exitRule"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class3.prototype, "accept"), _class3.prototype)), _class3);
exports.Binding_policyContext = Binding_policyContext;
let Binding_setContext = (_class4 = class Binding_setContext extends _ParserRuleContext.ParserRuleContext {
  LBRACES() {
    return this.getToken(binding_grammarParser.LBRACES, 0);
  }

  binding_statement(i) {
    if (i === undefined) {
      return this.getRuleContexts(Binding_statementContext);
    } else {
      return this.getRuleContext(i, Binding_statementContext);
    }
  }

  RBRACES() {
    return this.getToken(binding_grammarParser.RBRACES, 0);
  }

  SEMICOLON(i) {
    if (i === undefined) {
      return this.getTokens(binding_grammarParser.SEMICOLON);
    } else {
      return this.getToken(binding_grammarParser.SEMICOLON, i);
    }
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_binding_set;
  }

  enterRule(listener) {
    if (listener.enterBinding_set) listener.enterBinding_set(this);
  }

  exitRule(listener) {
    if (listener.exitBinding_set) listener.exitBinding_set(this);
  }

  accept(visitor) {
    if (visitor.visitBinding_set) return visitor.visitBinding_set(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class4.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class4.prototype, "ruleIndex"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class4.prototype, "enterRule"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class4.prototype, "exitRule"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class4.prototype, "accept"), _class4.prototype)), _class4);
exports.Binding_setContext = Binding_setContext;
let Unbinding_setContext = (_class5 = class Unbinding_setContext extends _ParserRuleContext.ParserRuleContext {
  LBRACES() {
    return this.getToken(binding_grammarParser.LBRACES, 0);
  }

  RBRACES() {
    return this.getToken(binding_grammarParser.RBRACES, 0);
  }

  unbinding_statement(i) {
    if (i === undefined) {
      return this.getRuleContexts(Unbinding_statementContext);
    } else {
      return this.getRuleContext(i, Unbinding_statementContext);
    }
  }

  SEMICOLON(i) {
    if (i === undefined) {
      return this.getTokens(binding_grammarParser.SEMICOLON);
    } else {
      return this.getToken(binding_grammarParser.SEMICOLON, i);
    }
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_unbinding_set;
  }

  enterRule(listener) {
    if (listener.enterUnbinding_set) listener.enterUnbinding_set(this);
  }

  exitRule(listener) {
    if (listener.exitUnbinding_set) listener.exitUnbinding_set(this);
  }

  accept(visitor) {
    if (visitor.visitUnbinding_set) return visitor.visitUnbinding_set(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class5.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class5.prototype, "ruleIndex"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class5.prototype, "enterRule"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class5.prototype, "exitRule"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class5.prototype, "accept"), _class5.prototype)), _class5);
exports.Unbinding_setContext = Unbinding_setContext;
let Binding_statementContext = (_class6 = class Binding_statementContext extends _ParserRuleContext.ParserRuleContext {
  is_creator() {
    return this.tryGetRuleContext(0, Is_creatorContext);
  }

  nominator() {
    return this.tryGetRuleContext(0, NominatorContext);
  }

  NOMINATES() {
    return this.tryGetToken(binding_grammarParser.NOMINATES, 0);
  }

  nominee() {
    return this.tryGetRuleContext(0, NomineeContext);
  }

  scope_restriction() {
    return this.tryGetRuleContext(0, Scope_restrictionContext);
  }

  binding_constr() {
    return this.tryGetRuleContext(0, Binding_constrContext);
  }

  endorsement_constr() {
    return this.tryGetRuleContext(0, Endorsement_constrContext);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_binding_statement;
  }

  enterRule(listener) {
    if (listener.enterBinding_statement) listener.enterBinding_statement(this);
  }

  exitRule(listener) {
    if (listener.exitBinding_statement) listener.exitBinding_statement(this);
  }

  accept(visitor) {
    if (visitor.visitBinding_statement) return visitor.visitBinding_statement(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class6.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class6.prototype, "ruleIndex"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class6.prototype, "enterRule"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class6.prototype, "exitRule"), _class6.prototype), _applyDecoratedDescriptor(_class6.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class6.prototype, "accept"), _class6.prototype)), _class6);
exports.Binding_statementContext = Binding_statementContext;
let Unbinding_statementContext = (_class7 = class Unbinding_statementContext extends _ParserRuleContext.ParserRuleContext {
  nominator() {
    return this.getRuleContext(0, NominatorContext);
  }

  RELEASES() {
    return this.getToken(binding_grammarParser.RELEASES, 0);
  }

  nominee() {
    return this.getRuleContext(0, NomineeContext);
  }

  binding_constr() {
    return this.tryGetRuleContext(0, Binding_constrContext);
  }

  endorsement_constr() {
    return this.tryGetRuleContext(0, Endorsement_constrContext);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_unbinding_statement;
  }

  enterRule(listener) {
    if (listener.enterUnbinding_statement) listener.enterUnbinding_statement(this);
  }

  exitRule(listener) {
    if (listener.exitUnbinding_statement) listener.exitUnbinding_statement(this);
  }

  accept(visitor) {
    if (visitor.visitUnbinding_statement) return visitor.visitUnbinding_statement(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class7.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class7.prototype, "ruleIndex"), _class7.prototype), _applyDecoratedDescriptor(_class7.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class7.prototype, "enterRule"), _class7.prototype), _applyDecoratedDescriptor(_class7.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class7.prototype, "exitRule"), _class7.prototype), _applyDecoratedDescriptor(_class7.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class7.prototype, "accept"), _class7.prototype)), _class7);
exports.Unbinding_statementContext = Unbinding_statementContext;
let Is_creatorContext = (_class8 = class Is_creatorContext extends _ParserRuleContext.ParserRuleContext {
  role() {
    return this.getRuleContext(0, RoleContext);
  }

  IS() {
    return this.getToken(binding_grammarParser.IS, 0);
  }

  CASE_CREATOR() {
    return this.getToken(binding_grammarParser.CASE_CREATOR, 0);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_is_creator;
  }

  enterRule(listener) {
    if (listener.enterIs_creator) listener.enterIs_creator(this);
  }

  exitRule(listener) {
    if (listener.exitIs_creator) listener.exitIs_creator(this);
  }

  accept(visitor) {
    if (visitor.visitIs_creator) return visitor.visitIs_creator(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class8.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class8.prototype, "ruleIndex"), _class8.prototype), _applyDecoratedDescriptor(_class8.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class8.prototype, "enterRule"), _class8.prototype), _applyDecoratedDescriptor(_class8.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class8.prototype, "exitRule"), _class8.prototype), _applyDecoratedDescriptor(_class8.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class8.prototype, "accept"), _class8.prototype)), _class8);
exports.Is_creatorContext = Is_creatorContext;
let Binding_constrContext = (_class9 = class Binding_constrContext extends _ParserRuleContext.ParserRuleContext {
  NOT() {
    return this.tryGetToken(binding_grammarParser.NOT, 0);
  }

  IN() {
    return this.getToken(binding_grammarParser.IN, 0);
  }

  set_expresion() {
    return this.getRuleContext(0, Set_expresionContext);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_binding_constr;
  }

  enterRule(listener) {
    if (listener.enterBinding_constr) listener.enterBinding_constr(this);
  }

  exitRule(listener) {
    if (listener.exitBinding_constr) listener.exitBinding_constr(this);
  }

  accept(visitor) {
    if (visitor.visitBinding_constr) return visitor.visitBinding_constr(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class9.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class9.prototype, "ruleIndex"), _class9.prototype), _applyDecoratedDescriptor(_class9.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class9.prototype, "enterRule"), _class9.prototype), _applyDecoratedDescriptor(_class9.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class9.prototype, "exitRule"), _class9.prototype), _applyDecoratedDescriptor(_class9.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class9.prototype, "accept"), _class9.prototype)), _class9);
exports.Binding_constrContext = Binding_constrContext;
let Endorsement_constrContext = (_class10 = class Endorsement_constrContext extends _ParserRuleContext.ParserRuleContext {
  ENDORSED_BY() {
    return this.getToken(binding_grammarParser.ENDORSED_BY, 0);
  }

  set_expresion() {
    return this.getRuleContext(0, Set_expresionContext);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_endorsement_constr;
  }

  enterRule(listener) {
    if (listener.enterEndorsement_constr) listener.enterEndorsement_constr(this);
  }

  exitRule(listener) {
    if (listener.exitEndorsement_constr) listener.exitEndorsement_constr(this);
  }

  accept(visitor) {
    if (visitor.visitEndorsement_constr) return visitor.visitEndorsement_constr(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class10.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class10.prototype, "ruleIndex"), _class10.prototype), _applyDecoratedDescriptor(_class10.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class10.prototype, "enterRule"), _class10.prototype), _applyDecoratedDescriptor(_class10.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class10.prototype, "exitRule"), _class10.prototype), _applyDecoratedDescriptor(_class10.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class10.prototype, "accept"), _class10.prototype)), _class10);
exports.Endorsement_constrContext = Endorsement_constrContext;
let Set_expresionContext = (_class11 = class Set_expresionContext extends _ParserRuleContext.ParserRuleContext {
  LPAREN() {
    return this.tryGetToken(binding_grammarParser.LPAREN, 0);
  }

  set_expresion() {
    return this.tryGetRuleContext(0, Set_expresionContext);
  }

  RPAREN() {
    return this.tryGetToken(binding_grammarParser.RPAREN, 0);
  }

  role() {
    return this.tryGetRuleContext(0, RoleContext);
  }

  OR() {
    return this.tryGetToken(binding_grammarParser.OR, 0);
  }

  AND() {
    return this.tryGetToken(binding_grammarParser.AND, 0);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_set_expresion;
  }

  enterRule(listener) {
    if (listener.enterSet_expresion) listener.enterSet_expresion(this);
  }

  exitRule(listener) {
    if (listener.exitSet_expresion) listener.exitSet_expresion(this);
  }

  accept(visitor) {
    if (visitor.visitSet_expresion) return visitor.visitSet_expresion(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class11.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class11.prototype, "ruleIndex"), _class11.prototype), _applyDecoratedDescriptor(_class11.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class11.prototype, "enterRule"), _class11.prototype), _applyDecoratedDescriptor(_class11.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class11.prototype, "exitRule"), _class11.prototype), _applyDecoratedDescriptor(_class11.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class11.prototype, "accept"), _class11.prototype)), _class11);
exports.Set_expresionContext = Set_expresionContext;
let Scope_restrictionContext = (_class12 = class Scope_restrictionContext extends _ParserRuleContext.ParserRuleContext {
  UNDER() {
    return this.getToken(binding_grammarParser.UNDER, 0);
  }

  subprocess_id() {
    return this.getRuleContext(0, Subprocess_idContext);
  }

  COMMA() {
    return this.getToken(binding_grammarParser.COMMA, 0);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_scope_restriction;
  }

  enterRule(listener) {
    if (listener.enterScope_restriction) listener.enterScope_restriction(this);
  }

  exitRule(listener) {
    if (listener.exitScope_restriction) listener.exitScope_restriction(this);
  }

  accept(visitor) {
    if (visitor.visitScope_restriction) return visitor.visitScope_restriction(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class12.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class12.prototype, "ruleIndex"), _class12.prototype), _applyDecoratedDescriptor(_class12.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class12.prototype, "enterRule"), _class12.prototype), _applyDecoratedDescriptor(_class12.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class12.prototype, "exitRule"), _class12.prototype), _applyDecoratedDescriptor(_class12.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class12.prototype, "accept"), _class12.prototype)), _class12);
exports.Scope_restrictionContext = Scope_restrictionContext;
let NominatorContext = (_class13 = class NominatorContext extends _ParserRuleContext.ParserRuleContext {
  role() {
    return this.getRuleContext(0, RoleContext);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_nominator;
  }

  enterRule(listener) {
    if (listener.enterNominator) listener.enterNominator(this);
  }

  exitRule(listener) {
    if (listener.exitNominator) listener.exitNominator(this);
  }

  accept(visitor) {
    if (visitor.visitNominator) return visitor.visitNominator(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class13.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class13.prototype, "ruleIndex"), _class13.prototype), _applyDecoratedDescriptor(_class13.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class13.prototype, "enterRule"), _class13.prototype), _applyDecoratedDescriptor(_class13.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class13.prototype, "exitRule"), _class13.prototype), _applyDecoratedDescriptor(_class13.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class13.prototype, "accept"), _class13.prototype)), _class13);
exports.NominatorContext = NominatorContext;
let NomineeContext = (_class14 = class NomineeContext extends _ParserRuleContext.ParserRuleContext {
  role() {
    return this.getRuleContext(0, RoleContext);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_nominee;
  }

  enterRule(listener) {
    if (listener.enterNominee) listener.enterNominee(this);
  }

  exitRule(listener) {
    if (listener.exitNominee) listener.exitNominee(this);
  }

  accept(visitor) {
    if (visitor.visitNominee) return visitor.visitNominee(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class14.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class14.prototype, "ruleIndex"), _class14.prototype), _applyDecoratedDescriptor(_class14.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class14.prototype, "enterRule"), _class14.prototype), _applyDecoratedDescriptor(_class14.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class14.prototype, "exitRule"), _class14.prototype), _applyDecoratedDescriptor(_class14.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class14.prototype, "accept"), _class14.prototype)), _class14);
exports.NomineeContext = NomineeContext;
let RoleContext = (_class15 = class RoleContext extends _ParserRuleContext.ParserRuleContext {
  role_id() {
    return this.tryGetRuleContext(0, Role_idContext);
  }

  role_path_expresion() {
    return this.tryGetRuleContext(0, Role_path_expresionContext);
  }

  SELF() {
    return this.tryGetToken(binding_grammarParser.SELF, 0);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_role;
  }

  enterRule(listener) {
    if (listener.enterRole) listener.enterRole(this);
  }

  exitRule(listener) {
    if (listener.exitRole) listener.exitRole(this);
  }

  accept(visitor) {
    if (visitor.visitRole) return visitor.visitRole(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class15.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class15.prototype, "ruleIndex"), _class15.prototype), _applyDecoratedDescriptor(_class15.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class15.prototype, "enterRule"), _class15.prototype), _applyDecoratedDescriptor(_class15.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class15.prototype, "exitRule"), _class15.prototype), _applyDecoratedDescriptor(_class15.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class15.prototype, "accept"), _class15.prototype)), _class15);
exports.RoleContext = RoleContext;
let Role_path_expresionContext = (_class16 = class Role_path_expresionContext extends _ParserRuleContext.ParserRuleContext {
  role_id() {
    return this.getRuleContext(0, Role_idContext);
  }

  subprocess_id(i) {
    if (i === undefined) {
      return this.getRuleContexts(Subprocess_idContext);
    } else {
      return this.getRuleContext(i, Subprocess_idContext);
    }
  }

  DOT(i) {
    if (i === undefined) {
      return this.getTokens(binding_grammarParser.DOT);
    } else {
      return this.getToken(binding_grammarParser.DOT, i);
    }
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_role_path_expresion;
  }

  enterRule(listener) {
    if (listener.enterRole_path_expresion) listener.enterRole_path_expresion(this);
  }

  exitRule(listener) {
    if (listener.exitRole_path_expresion) listener.exitRole_path_expresion(this);
  }

  accept(visitor) {
    if (visitor.visitRole_path_expresion) return visitor.visitRole_path_expresion(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class16.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class16.prototype, "ruleIndex"), _class16.prototype), _applyDecoratedDescriptor(_class16.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class16.prototype, "enterRule"), _class16.prototype), _applyDecoratedDescriptor(_class16.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class16.prototype, "exitRule"), _class16.prototype), _applyDecoratedDescriptor(_class16.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class16.prototype, "accept"), _class16.prototype)), _class16);
exports.Role_path_expresionContext = Role_path_expresionContext;
let Subprocess_idContext = (_class17 = class Subprocess_idContext extends _ParserRuleContext.ParserRuleContext {
  IDENTIFIER() {
    return this.getToken(binding_grammarParser.IDENTIFIER, 0);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_subprocess_id;
  }

  enterRule(listener) {
    if (listener.enterSubprocess_id) listener.enterSubprocess_id(this);
  }

  exitRule(listener) {
    if (listener.exitSubprocess_id) listener.exitSubprocess_id(this);
  }

  accept(visitor) {
    if (visitor.visitSubprocess_id) return visitor.visitSubprocess_id(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class17.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class17.prototype, "ruleIndex"), _class17.prototype), _applyDecoratedDescriptor(_class17.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class17.prototype, "enterRule"), _class17.prototype), _applyDecoratedDescriptor(_class17.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class17.prototype, "exitRule"), _class17.prototype), _applyDecoratedDescriptor(_class17.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class17.prototype, "accept"), _class17.prototype)), _class17);
exports.Subprocess_idContext = Subprocess_idContext;
let Role_idContext = (_class18 = class Role_idContext extends _ParserRuleContext.ParserRuleContext {
  IDENTIFIER() {
    return this.getToken(binding_grammarParser.IDENTIFIER, 0);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_role_id;
  }

  enterRule(listener) {
    if (listener.enterRole_id) listener.enterRole_id(this);
  }

  exitRule(listener) {
    if (listener.exitRole_id) listener.exitRole_id(this);
  }

  accept(visitor) {
    if (visitor.visitRole_id) return visitor.visitRole_id(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class18.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class18.prototype, "ruleIndex"), _class18.prototype), _applyDecoratedDescriptor(_class18.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class18.prototype, "enterRule"), _class18.prototype), _applyDecoratedDescriptor(_class18.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class18.prototype, "exitRule"), _class18.prototype), _applyDecoratedDescriptor(_class18.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class18.prototype, "accept"), _class18.prototype)), _class18);
exports.Role_idContext = Role_idContext;
let Task_idContext = (_class19 = class Task_idContext extends _ParserRuleContext.ParserRuleContext {
  IDENTIFIER() {
    return this.getToken(binding_grammarParser.IDENTIFIER, 0);
  }

  constructor(parent, invokingState) {
    super(parent, invokingState);
  }

  get ruleIndex() {
    return binding_grammarParser.RULE_task_id;
  }

  enterRule(listener) {
    if (listener.enterTask_id) listener.enterTask_id(this);
  }

  exitRule(listener) {
    if (listener.exitTask_id) listener.exitTask_id(this);
  }

  accept(visitor) {
    if (visitor.visitTask_id) return visitor.visitTask_id(this);else return visitor.visitChildren(this);
  }

}, (_applyDecoratedDescriptor(_class19.prototype, "ruleIndex", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class19.prototype, "ruleIndex"), _class19.prototype), _applyDecoratedDescriptor(_class19.prototype, "enterRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class19.prototype, "enterRule"), _class19.prototype), _applyDecoratedDescriptor(_class19.prototype, "exitRule", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class19.prototype, "exitRule"), _class19.prototype), _applyDecoratedDescriptor(_class19.prototype, "accept", [_Decorators.Override], Object.getOwnPropertyDescriptor(_class19.prototype, "accept"), _class19.prototype)), _class19);
exports.Task_idContext = Task_idContext;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vcG9saWN5L2R5bmFtaWNfYmluZGluZy9hbnRsci9iaW5kaW5nX2dyYW1tYXJQYXJzZXIudHMiXSwibmFtZXMiOlsiTElURVJBTF9OQU1FUyIsInVuZGVmaW5lZCIsIlNZTUJPTElDX05BTUVTIiwiYmluZGluZ19ncmFtbWFyUGFyc2VyIiwiUGFyc2VyIiwidm9jYWJ1bGFyeSIsIlZPQ0FCVUxBUlkiLCJncmFtbWFyRmlsZU5hbWUiLCJydWxlTmFtZXMiLCJzZXJpYWxpemVkQVROIiwiX3NlcmlhbGl6ZWRBVE4iLCJjb25zdHJ1Y3RvciIsImlucHV0IiwiX2ludGVycCIsIlBhcnNlckFUTlNpbXVsYXRvciIsIl9BVE4iLCJiaW5kaW5nX3BvbGljeSIsIl9sb2NhbGN0eCIsIkJpbmRpbmdfcG9saWN5Q29udGV4dCIsIl9jdHgiLCJzdGF0ZSIsImVudGVyUnVsZSIsIlJVTEVfYmluZGluZ19wb2xpY3kiLCJlbnRlck91dGVyQWx0IiwiYmluZGluZ19zZXQiLCJ1bmJpbmRpbmdfc2V0IiwicmUiLCJSZWNvZ25pdGlvbkV4Y2VwdGlvbiIsImV4Y2VwdGlvbiIsIl9lcnJIYW5kbGVyIiwicmVwb3J0RXJyb3IiLCJyZWNvdmVyIiwiZXhpdFJ1bGUiLCJCaW5kaW5nX3NldENvbnRleHQiLCJSVUxFX2JpbmRpbmdfc2V0IiwiX2xhIiwibWF0Y2giLCJMQlJBQ0VTIiwiYmluZGluZ19zdGF0ZW1lbnQiLCJzeW5jIiwiX2lucHV0IiwiTEEiLCJTRU1JQ09MT04iLCJSQlJBQ0VTIiwiVW5iaW5kaW5nX3NldENvbnRleHQiLCJSVUxFX3VuYmluZGluZ19zZXQiLCJTRUxGIiwiSURFTlRJRklFUiIsInVuYmluZGluZ19zdGF0ZW1lbnQiLCJOb1ZpYWJsZUFsdEV4Y2VwdGlvbiIsIkJpbmRpbmdfc3RhdGVtZW50Q29udGV4dCIsIlJVTEVfYmluZGluZ19zdGF0ZW1lbnQiLCJpbnRlcnByZXRlciIsImFkYXB0aXZlUHJlZGljdCIsImlzX2NyZWF0b3IiLCJVTkRFUiIsInNjb3BlX3Jlc3RyaWN0aW9uIiwibm9taW5hdG9yIiwiTk9NSU5BVEVTIiwibm9taW5lZSIsIklOIiwiTk9UIiwiYmluZGluZ19jb25zdHIiLCJFTkRPUlNFRF9CWSIsImVuZG9yc2VtZW50X2NvbnN0ciIsIlVuYmluZGluZ19zdGF0ZW1lbnRDb250ZXh0IiwiUlVMRV91bmJpbmRpbmdfc3RhdGVtZW50IiwiUkVMRUFTRVMiLCJJc19jcmVhdG9yQ29udGV4dCIsIlJVTEVfaXNfY3JlYXRvciIsInJvbGUiLCJJUyIsIkNBU0VfQ1JFQVRPUiIsIkJpbmRpbmdfY29uc3RyQ29udGV4dCIsIlJVTEVfYmluZGluZ19jb25zdHIiLCJzZXRfZXhwcmVzaW9uIiwiRW5kb3JzZW1lbnRfY29uc3RyQ29udGV4dCIsIlJVTEVfZW5kb3JzZW1lbnRfY29uc3RyIiwiU2V0X2V4cHJlc2lvbkNvbnRleHQiLCJSVUxFX3NldF9leHByZXNpb24iLCJMUEFSRU4iLCJSUEFSRU4iLCJPUiIsIkFORCIsIlNjb3BlX3Jlc3RyaWN0aW9uQ29udGV4dCIsIlJVTEVfc2NvcGVfcmVzdHJpY3Rpb24iLCJzdWJwcm9jZXNzX2lkIiwiQ09NTUEiLCJOb21pbmF0b3JDb250ZXh0IiwiUlVMRV9ub21pbmF0b3IiLCJOb21pbmVlQ29udGV4dCIsIlJVTEVfbm9taW5lZSIsIlJvbGVDb250ZXh0IiwiUlVMRV9yb2xlIiwicm9sZV9pZCIsInJvbGVfcGF0aF9leHByZXNpb24iLCJSb2xlX3BhdGhfZXhwcmVzaW9uQ29udGV4dCIsIlJVTEVfcm9sZV9wYXRoX2V4cHJlc2lvbiIsIl9hbHQiLCJET1QiLCJBVE4iLCJJTlZBTElEX0FMVF9OVU1CRVIiLCJTdWJwcm9jZXNzX2lkQ29udGV4dCIsIlJVTEVfc3VicHJvY2Vzc19pZCIsIlJvbGVfaWRDb250ZXh0IiwiUlVMRV9yb2xlX2lkIiwidGFza19pZCIsIlRhc2tfaWRDb250ZXh0IiwiUlVMRV90YXNrX2lkIiwiX19BVE4iLCJBVE5EZXNlcmlhbGl6ZXIiLCJkZXNlcmlhbGl6ZSIsIlV0aWxzIiwidG9DaGFyQXJyYXkiLCJWb2NhYnVsYXJ5SW1wbCIsIk92ZXJyaWRlIiwiTm90TnVsbCIsIlBhcnNlclJ1bGVDb250ZXh0IiwiZ2V0UnVsZUNvbnRleHQiLCJwYXJlbnQiLCJpbnZva2luZ1N0YXRlIiwicnVsZUluZGV4IiwibGlzdGVuZXIiLCJlbnRlckJpbmRpbmdfcG9saWN5IiwiZXhpdEJpbmRpbmdfcG9saWN5IiwiYWNjZXB0IiwidmlzaXRvciIsInZpc2l0QmluZGluZ19wb2xpY3kiLCJ2aXNpdENoaWxkcmVuIiwiZ2V0VG9rZW4iLCJpIiwiZ2V0UnVsZUNvbnRleHRzIiwiZ2V0VG9rZW5zIiwiZW50ZXJCaW5kaW5nX3NldCIsImV4aXRCaW5kaW5nX3NldCIsInZpc2l0QmluZGluZ19zZXQiLCJlbnRlclVuYmluZGluZ19zZXQiLCJleGl0VW5iaW5kaW5nX3NldCIsInZpc2l0VW5iaW5kaW5nX3NldCIsInRyeUdldFJ1bGVDb250ZXh0IiwidHJ5R2V0VG9rZW4iLCJlbnRlckJpbmRpbmdfc3RhdGVtZW50IiwiZXhpdEJpbmRpbmdfc3RhdGVtZW50IiwidmlzaXRCaW5kaW5nX3N0YXRlbWVudCIsImVudGVyVW5iaW5kaW5nX3N0YXRlbWVudCIsImV4aXRVbmJpbmRpbmdfc3RhdGVtZW50IiwidmlzaXRVbmJpbmRpbmdfc3RhdGVtZW50IiwiZW50ZXJJc19jcmVhdG9yIiwiZXhpdElzX2NyZWF0b3IiLCJ2aXNpdElzX2NyZWF0b3IiLCJlbnRlckJpbmRpbmdfY29uc3RyIiwiZXhpdEJpbmRpbmdfY29uc3RyIiwidmlzaXRCaW5kaW5nX2NvbnN0ciIsImVudGVyRW5kb3JzZW1lbnRfY29uc3RyIiwiZXhpdEVuZG9yc2VtZW50X2NvbnN0ciIsInZpc2l0RW5kb3JzZW1lbnRfY29uc3RyIiwiZW50ZXJTZXRfZXhwcmVzaW9uIiwiZXhpdFNldF9leHByZXNpb24iLCJ2aXNpdFNldF9leHByZXNpb24iLCJlbnRlclNjb3BlX3Jlc3RyaWN0aW9uIiwiZXhpdFNjb3BlX3Jlc3RyaWN0aW9uIiwidmlzaXRTY29wZV9yZXN0cmljdGlvbiIsImVudGVyTm9taW5hdG9yIiwiZXhpdE5vbWluYXRvciIsInZpc2l0Tm9taW5hdG9yIiwiZW50ZXJOb21pbmVlIiwiZXhpdE5vbWluZWUiLCJ2aXNpdE5vbWluZWUiLCJlbnRlclJvbGUiLCJleGl0Um9sZSIsInZpc2l0Um9sZSIsImVudGVyUm9sZV9wYXRoX2V4cHJlc2lvbiIsImV4aXRSb2xlX3BhdGhfZXhwcmVzaW9uIiwidmlzaXRSb2xlX3BhdGhfZXhwcmVzaW9uIiwiZW50ZXJTdWJwcm9jZXNzX2lkIiwiZXhpdFN1YnByb2Nlc3NfaWQiLCJ2aXNpdFN1YnByb2Nlc3NfaWQiLCJlbnRlclJvbGVfaWQiLCJleGl0Um9sZV9pZCIsInZpc2l0Um9sZV9pZCIsImVudGVyVGFza19pZCIsImV4aXRUYXNrX2lkIiwidmlzaXRUYXNrX2lkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBR0E7O0FBRUE7O0FBS0E7O0FBRUE7Ozs7Ozs7Ozs7QUFLQSxNQUFNQSxhQUFhLEdBQUcsQ0FDckJDLFNBRHFCLEVBQ1YsYUFEVSxFQUNLLFlBREwsRUFDbUIsUUFEbkIsRUFDNkJBLFNBRDdCLEVBQ3dDLGdCQUR4QyxFQUVyQixPQUZxQixFQUVaLE1BRlksRUFFSixNQUZJLEVBRUksTUFGSixFQUVZLE9BRlosRUFFcUIsU0FGckIsRUFFZ0MsS0FGaEMsRUFFdUMsS0FGdkMsRUFFOEMsS0FGOUMsRUFHckIsS0FIcUIsRUFHZCxLQUhjLEVBR1AsS0FITyxFQUdBLEtBSEEsQ0FBdEI7QUFLQSxNQUFNQyxjQUFjLEdBQUcsQ0FDdEJELFNBRHNCLEVBQ1gsV0FEVyxFQUNFLFVBREYsRUFDYyxNQURkLEVBQ3NCLGFBRHRCLEVBQ3FDLGNBRHJDLEVBRXRCLEtBRnNCLEVBRWYsSUFGZSxFQUVULElBRlMsRUFFSCxJQUZHLEVBRUcsS0FGSCxFQUVVLE9BRlYs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QUFPLENBQUNFLGFBQVIsQ0FBc0IsSUFBdEIsQ0FBUDtBQUNMOztBQXBCb0QsQywrREFPcERiLG9CLHNKQUNBQSxvQixxSkFJQUEsb0Isa0pBSUFBLG9COztJQVFXUixjLGVBQU4sTUFBTUEsY0FBTixTQUE2QlUsb0NBQTdCLENBQStDO0FBQzlDdEUsRUFBQUEsVUFBUCxHQUFrQztBQUFFLFdBQU8sS0FBS2tGLFFBQUwsQ0FBYzlILHFCQUFxQixDQUFDNEMsVUFBcEMsRUFBZ0QsQ0FBaEQsQ0FBUDtBQUE0RDs7QUFFaEdwQyxFQUFBQSxXQUFXLENBQUM0RyxNQUFELEVBQTRCQyxhQUE1QixFQUFtRDtBQUM3RCxVQUFNRCxNQUFOLEVBQWNDLGFBQWQ7QUFFQTs7QUFDRCxNQUFxQkMsU0FBckIsR0FBeUM7QUFBRSxXQUFPdEgscUJBQXFCLENBQUN5RyxZQUE3QjtBQUE0Qzs7QUFFaEZ2RixFQUFBQSxTQURQLENBQ2lCcUcsUUFEakIsRUFDMEQ7QUFDekQsUUFBSUEsUUFBUSxDQUFDMEQsWUFBYixFQUEyQjFELFFBQVEsQ0FBQzBELFlBQVQsQ0FBc0IsSUFBdEI7QUFDM0I7O0FBRU1wSixFQUFBQSxRQURQLENBQ2dCMEYsUUFEaEIsRUFDeUQ7QUFDeEQsUUFBSUEsUUFBUSxDQUFDMkQsV0FBYixFQUEwQjNELFFBQVEsQ0FBQzJELFdBQVQsQ0FBcUIsSUFBckI7QUFDMUI7O0FBRU14RCxFQUFBQSxNQURQLENBQ3NCQyxPQUR0QixFQUN1RTtBQUN0RSxRQUFJQSxPQUFPLENBQUN3RCxZQUFaLEVBQTBCLE9BQU94RCxPQUFPLENBQUN3RCxZQUFSLENBQXFCLElBQXJCLENBQVAsQ0FBMUIsS0FDSyxPQUFPeEQsT0FBTyxDQUFDRSxhQUFSLENBQXNCLElBQXRCLENBQVA7QUFDTDs7QUFwQm9ELEMsK0RBT3BEYixvQixzSkFDQUEsb0IscUpBSUFBLG9CLGtKQUlBQSxvQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEdlbmVyYXRlZCBmcm9tIC4vc3JjL21vZGVscy9keW5hbWljX2JpbmRpbmcvYW50bHIvYmluZGluZ19ncmFtbWFyLmc0IGJ5IEFOVExSIDQuNi1TTkFQU0hPVFxuXG5cbmltcG9ydCB7IEFUTiB9IGZyb20gJ2FudGxyNHRzL2F0bi9BVE4nO1xuaW1wb3J0IHsgQVRORGVzZXJpYWxpemVyIH0gZnJvbSAnYW50bHI0dHMvYXRuL0FUTkRlc2VyaWFsaXplcic7XG5pbXBvcnQgeyBGYWlsZWRQcmVkaWNhdGVFeGNlcHRpb24gfSBmcm9tICdhbnRscjR0cy9GYWlsZWRQcmVkaWNhdGVFeGNlcHRpb24nO1xuaW1wb3J0IHsgTm90TnVsbCB9IGZyb20gJ2FudGxyNHRzL0RlY29yYXRvcnMnO1xuaW1wb3J0IHsgTm9WaWFibGVBbHRFeGNlcHRpb24gfSBmcm9tICdhbnRscjR0cy9Ob1ZpYWJsZUFsdEV4Y2VwdGlvbic7XG5pbXBvcnQgeyBPdmVycmlkZSB9IGZyb20gJ2FudGxyNHRzL0RlY29yYXRvcnMnO1xuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSAnYW50bHI0dHMvUGFyc2VyJztcbmltcG9ydCB7IFBhcnNlclJ1bGVDb250ZXh0IH0gZnJvbSAnYW50bHI0dHMvUGFyc2VyUnVsZUNvbnRleHQnO1xuaW1wb3J0IHsgUGFyc2VyQVROU2ltdWxhdG9yIH0gZnJvbSAnYW50bHI0dHMvYXRuL1BhcnNlckFUTlNpbXVsYXRvcic7XG5pbXBvcnQgeyBQYXJzZVRyZWVMaXN0ZW5lciB9IGZyb20gJ2FudGxyNHRzL3RyZWUvUGFyc2VUcmVlTGlzdGVuZXInO1xuaW1wb3J0IHsgUGFyc2VUcmVlVmlzaXRvciB9IGZyb20gJ2FudGxyNHRzL3RyZWUvUGFyc2VUcmVlVmlzaXRvcic7XG5pbXBvcnQgeyBSZWNvZ25pdGlvbkV4Y2VwdGlvbiB9IGZyb20gJ2FudGxyNHRzL1JlY29nbml0aW9uRXhjZXB0aW9uJztcbmltcG9ydCB7IFJ1bGVDb250ZXh0IH0gZnJvbSAnYW50bHI0dHMvUnVsZUNvbnRleHQnO1xuaW1wb3J0IHsgUnVsZVZlcnNpb24gfSBmcm9tICdhbnRscjR0cy9SdWxlVmVyc2lvbic7XG5pbXBvcnQgeyBUZXJtaW5hbE5vZGUgfSBmcm9tICdhbnRscjR0cy90cmVlL1Rlcm1pbmFsTm9kZSc7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gJ2FudGxyNHRzL1Rva2VuJztcbmltcG9ydCB7IFRva2VuU3RyZWFtIH0gZnJvbSAnYW50bHI0dHMvVG9rZW5TdHJlYW0nO1xuaW1wb3J0IHsgVm9jYWJ1bGFyeSB9IGZyb20gJ2FudGxyNHRzL1ZvY2FidWxhcnknO1xuaW1wb3J0IHsgVm9jYWJ1bGFyeUltcGwgfSBmcm9tICdhbnRscjR0cy9Wb2NhYnVsYXJ5SW1wbCc7XG5cbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJ2FudGxyNHRzL21pc2MvVXRpbHMnO1xuXG5pbXBvcnQgeyBiaW5kaW5nX2dyYW1tYXJMaXN0ZW5lciB9IGZyb20gJy4vYmluZGluZ19ncmFtbWFyTGlzdGVuZXInO1xuaW1wb3J0IHsgYmluZGluZ19ncmFtbWFyVmlzaXRvciB9IGZyb20gJy4vYmluZGluZ19ncmFtbWFyVmlzaXRvcic7XG5cbmNvbnN0IExJVEVSQUxfTkFNRVMgPSBbXG5cdHVuZGVmaW5lZCwgXCInbm9taW5hdGVzJ1wiLCBcIidyZWxlYXNlcydcIiwgXCInc2VsZidcIiwgdW5kZWZpbmVkLCBcIidjYXNlLWNyZWF0b3InXCIsIFxuXHRcIidhbmQnXCIsIFwiJ29yJ1wiLCBcIidpcydcIiwgXCInaW4nXCIsIFwiJ25vdCdcIiwgXCInVW5kZXInXCIsIFwiJywnXCIsIFwiJy4nXCIsIFwiJzsnXCIsIFxuXHRcIicoJ1wiLCBcIicpJ1wiLCBcIid7J1wiLCBcIid9J1wiXG5dXG5jb25zdCBTWU1CT0xJQ19OQU1FUyA9IFtcblx0dW5kZWZpbmVkLCBcIk5PTUlOQVRFU1wiLCBcIlJFTEVBU0VTXCIsIFwiU0VMRlwiLCBcIkVORE9SU0VEX0JZXCIsIFwiQ0FTRV9DUkVBVE9SXCIsIFxuXHRcIkFORFwiLCBcIk9SXCIsIFwiSVNcIiwgXCJJTlwiLCBcIk5PVFwiLCBcIlVOREVSXCIsIFwiQ09NTUFcIiwgXCJET1RcIiwgXCJTRU1JQ09MT05cIiwgXG5cdFwiTFBBUkVOXCIsIFwiUlBBUkVOXCIsIFwiTEJSQUNFU1wiLCBcIlJCUkFDRVNcIiwgXCJJREVOVElGSUVSXCIsIFwiV1NcIlxuXVxuXG5cbmV4cG9ydCBjbGFzcyBiaW5kaW5nX2dyYW1tYXJQYXJzZXIgZXh0ZW5kcyBQYXJzZXIge1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE5PTUlOQVRFUz0xO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJFTEVBU0VTPTI7XG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU0VMRj0zO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEVORE9SU0VEX0JZPTQ7XG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0FTRV9DUkVBVE9SPTU7XG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQU5EPTY7XG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgT1I9Nztcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBJUz04O1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IElOPTk7XG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTk9UPTEwO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFVOREVSPTExO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENPTU1BPTEyO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERPVD0xMztcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBTRU1JQ09MT049MTQ7XG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTFBBUkVOPTE1O1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJQQVJFTj0xNjtcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBMQlJBQ0VTPTE3O1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJCUkFDRVM9MTg7XG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgSURFTlRJRklFUj0xOTtcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBXUz0yMDtcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBSVUxFX2JpbmRpbmdfcG9saWN5ID0gMDtcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBSVUxFX2JpbmRpbmdfc2V0ID0gMTtcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBSVUxFX3VuYmluZGluZ19zZXQgPSAyO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJVTEVfYmluZGluZ19zdGF0ZW1lbnQgPSAzO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJVTEVfdW5iaW5kaW5nX3N0YXRlbWVudCA9IDQ7XG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUlVMRV9pc19jcmVhdG9yID0gNTtcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBSVUxFX2JpbmRpbmdfY29uc3RyID0gNjtcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBSVUxFX2VuZG9yc2VtZW50X2NvbnN0ciA9IDc7XG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUlVMRV9zZXRfZXhwcmVzaW9uID0gODtcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBSVUxFX3Njb3BlX3Jlc3RyaWN0aW9uID0gOTtcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBSVUxFX25vbWluYXRvciA9IDEwO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJVTEVfbm9taW5lZSA9IDExO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJVTEVfcm9sZSA9IDEyO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJVTEVfcm9sZV9wYXRoX2V4cHJlc2lvbiA9IDEzO1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJVTEVfc3VicHJvY2Vzc19pZCA9IDE0O1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJVTEVfcm9sZV9pZCA9IDE1O1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJVTEVfdGFza19pZCA9IDE2O1xuXHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHJ1bGVOYW1lczogc3RyaW5nW10gPSBbXG5cdFx0XCJiaW5kaW5nX3BvbGljeVwiLCBcImJpbmRpbmdfc2V0XCIsIFwidW5iaW5kaW5nX3NldFwiLCBcImJpbmRpbmdfc3RhdGVtZW50XCIsIFxuXHRcdFwidW5iaW5kaW5nX3N0YXRlbWVudFwiLCBcImlzX2NyZWF0b3JcIiwgXCJiaW5kaW5nX2NvbnN0clwiLCBcImVuZG9yc2VtZW50X2NvbnN0clwiLCBcblx0XHRcInNldF9leHByZXNpb25cIiwgXCJzY29wZV9yZXN0cmljdGlvblwiLCBcIm5vbWluYXRvclwiLCBcIm5vbWluZWVcIiwgXCJyb2xlXCIsIFxuXHRcdFwicm9sZV9wYXRoX2V4cHJlc2lvblwiLCBcInN1YnByb2Nlc3NfaWRcIiwgXCJyb2xlX2lkXCIsIFwidGFza19pZFwiXG5cdF07XG5cblx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX0xJVEVSQUxfTkFNRVM6IChzdHJpbmcgfCB1bmRlZmluZWQpW10gPSBMSVRFUkFMX05BTUVTXG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF9TWU1CT0xJQ19OQU1FUzogKHN0cmluZyB8IHVuZGVmaW5lZClbXSA9IFNZTUJPTElDX05BTUVTXG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVk9DQUJVTEFSWTogVm9jYWJ1bGFyeSA9IG5ldyBWb2NhYnVsYXJ5SW1wbChMSVRFUkFMX05BTUVTLCBTWU1CT0xJQ19OQU1FUywgW10pO1xuXG5cdEBPdmVycmlkZVxuXHRATm90TnVsbFxuXHRwdWJsaWMgZ2V0IHZvY2FidWxhcnkoKTogVm9jYWJ1bGFyeSB7XG5cdFx0cmV0dXJuIGJpbmRpbmdfZ3JhbW1hclBhcnNlci5WT0NBQlVMQVJZO1xuXHR9XG5cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBnZXQgZ3JhbW1hckZpbGVOYW1lKCk6IHN0cmluZyB7IHJldHVybiBcImJpbmRpbmdfZ3JhbW1hci5nNFwiOyB9XG5cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBnZXQgcnVsZU5hbWVzKCk6IHN0cmluZ1tdIHsgcmV0dXJuIGJpbmRpbmdfZ3JhbW1hclBhcnNlci5ydWxlTmFtZXM7IH1cblxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGdldCBzZXJpYWxpemVkQVROKCk6IHN0cmluZyB7IHJldHVybiBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuX3NlcmlhbGl6ZWRBVE47IH1cblxuXHRjb25zdHJ1Y3RvcihpbnB1dDogVG9rZW5TdHJlYW0pIHtcblx0XHRzdXBlcihpbnB1dCk7XG5cdFx0dGhpcy5faW50ZXJwID0gbmV3IFBhcnNlckFUTlNpbXVsYXRvcihiaW5kaW5nX2dyYW1tYXJQYXJzZXIuX0FUTiwgdGhpcyk7XG5cdH1cblx0QFJ1bGVWZXJzaW9uKDApXG5cdHB1YmxpYyBiaW5kaW5nX3BvbGljeSgpOiBCaW5kaW5nX3BvbGljeUNvbnRleHQge1xuXHRcdGxldCBfbG9jYWxjdHg6IEJpbmRpbmdfcG9saWN5Q29udGV4dCA9IG5ldyBCaW5kaW5nX3BvbGljeUNvbnRleHQodGhpcy5fY3R4LCB0aGlzLnN0YXRlKTtcblx0XHR0aGlzLmVudGVyUnVsZShfbG9jYWxjdHgsIDAsIGJpbmRpbmdfZ3JhbW1hclBhcnNlci5SVUxFX2JpbmRpbmdfcG9saWN5KTtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5lbnRlck91dGVyQWx0KF9sb2NhbGN0eCwgMSk7XG5cdFx0XHR7XG5cdFx0XHR0aGlzLnN0YXRlID0gMzQ7XG5cdFx0XHR0aGlzLmJpbmRpbmdfc2V0KCk7XG5cdFx0XHR0aGlzLnN0YXRlID0gMzU7XG5cdFx0XHR0aGlzLnVuYmluZGluZ19zZXQoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y2F0Y2ggKHJlKSB7XG5cdFx0XHRpZiAocmUgaW5zdGFuY2VvZiBSZWNvZ25pdGlvbkV4Y2VwdGlvbikge1xuXHRcdFx0XHRfbG9jYWxjdHguZXhjZXB0aW9uID0gcmU7XG5cdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIucmVwb3J0RXJyb3IodGhpcywgcmUpO1xuXHRcdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnJlY292ZXIodGhpcywgcmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgcmU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZpbmFsbHkge1xuXHRcdFx0dGhpcy5leGl0UnVsZSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gX2xvY2FsY3R4O1xuXHR9XG5cdEBSdWxlVmVyc2lvbigwKVxuXHRwdWJsaWMgYmluZGluZ19zZXQoKTogQmluZGluZ19zZXRDb250ZXh0IHtcblx0XHRsZXQgX2xvY2FsY3R4OiBCaW5kaW5nX3NldENvbnRleHQgPSBuZXcgQmluZGluZ19zZXRDb250ZXh0KHRoaXMuX2N0eCwgdGhpcy5zdGF0ZSk7XG5cdFx0dGhpcy5lbnRlclJ1bGUoX2xvY2FsY3R4LCAyLCBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUlVMRV9iaW5kaW5nX3NldCk7XG5cdFx0bGV0IF9sYTogbnVtYmVyO1xuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmVudGVyT3V0ZXJBbHQoX2xvY2FsY3R4LCAxKTtcblx0XHRcdHtcblx0XHRcdHRoaXMuc3RhdGUgPSAzNztcblx0XHRcdHRoaXMubWF0Y2goYmluZGluZ19ncmFtbWFyUGFyc2VyLkxCUkFDRVMpO1xuXHRcdFx0dGhpcy5zdGF0ZSA9IDM4O1xuXHRcdFx0dGhpcy5iaW5kaW5nX3N0YXRlbWVudCgpO1xuXHRcdFx0dGhpcy5zdGF0ZSA9IDQzO1xuXHRcdFx0dGhpcy5fZXJySGFuZGxlci5zeW5jKHRoaXMpO1xuXHRcdFx0X2xhID0gdGhpcy5faW5wdXQuTEEoMSk7XG5cdFx0XHR3aGlsZSAoX2xhPT09YmluZGluZ19ncmFtbWFyUGFyc2VyLlNFTUlDT0xPTikge1xuXHRcdFx0XHR7XG5cdFx0XHRcdHtcblx0XHRcdFx0dGhpcy5zdGF0ZSA9IDM5O1xuXHRcdFx0XHR0aGlzLm1hdGNoKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5TRU1JQ09MT04pO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gNDA7XG5cdFx0XHRcdHRoaXMuYmluZGluZ19zdGF0ZW1lbnQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSA0NTtcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5zeW5jKHRoaXMpO1xuXHRcdFx0XHRfbGEgPSB0aGlzLl9pbnB1dC5MQSgxKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuc3RhdGUgPSA0Njtcblx0XHRcdHRoaXMubWF0Y2goYmluZGluZ19ncmFtbWFyUGFyc2VyLlJCUkFDRVMpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjYXRjaCAocmUpIHtcblx0XHRcdGlmIChyZSBpbnN0YW5jZW9mIFJlY29nbml0aW9uRXhjZXB0aW9uKSB7XG5cdFx0XHRcdF9sb2NhbGN0eC5leGNlcHRpb24gPSByZTtcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5yZXBvcnRFcnJvcih0aGlzLCByZSk7XG5cdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIucmVjb3Zlcih0aGlzLCByZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyByZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZmluYWxseSB7XG5cdFx0XHR0aGlzLmV4aXRSdWxlKCk7XG5cdFx0fVxuXHRcdHJldHVybiBfbG9jYWxjdHg7XG5cdH1cblx0QFJ1bGVWZXJzaW9uKDApXG5cdHB1YmxpYyB1bmJpbmRpbmdfc2V0KCk6IFVuYmluZGluZ19zZXRDb250ZXh0IHtcblx0XHRsZXQgX2xvY2FsY3R4OiBVbmJpbmRpbmdfc2V0Q29udGV4dCA9IG5ldyBVbmJpbmRpbmdfc2V0Q29udGV4dCh0aGlzLl9jdHgsIHRoaXMuc3RhdGUpO1xuXHRcdHRoaXMuZW50ZXJSdWxlKF9sb2NhbGN0eCwgNCwgYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfdW5iaW5kaW5nX3NldCk7XG5cdFx0bGV0IF9sYTogbnVtYmVyO1xuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmVudGVyT3V0ZXJBbHQoX2xvY2FsY3R4LCAxKTtcblx0XHRcdHtcblx0XHRcdHRoaXMuc3RhdGUgPSA0ODtcblx0XHRcdHRoaXMubWF0Y2goYmluZGluZ19ncmFtbWFyUGFyc2VyLkxCUkFDRVMpO1xuXHRcdFx0dGhpcy5zdGF0ZSA9IDU4O1xuXHRcdFx0dGhpcy5fZXJySGFuZGxlci5zeW5jKHRoaXMpO1xuXHRcdFx0c3dpdGNoICh0aGlzLl9pbnB1dC5MQSgxKSkge1xuXHRcdFx0Y2FzZSBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuU0VMRjpcblx0XHRcdGNhc2UgYmluZGluZ19ncmFtbWFyUGFyc2VyLklERU5USUZJRVI6XG5cdFx0XHRcdHtcblx0XHRcdFx0dGhpcy5zdGF0ZSA9IDQ5O1xuXHRcdFx0XHR0aGlzLnVuYmluZGluZ19zdGF0ZW1lbnQoKTtcblx0XHRcdFx0dGhpcy5zdGF0ZSA9IDU0O1xuXHRcdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnN5bmModGhpcyk7XG5cdFx0XHRcdF9sYSA9IHRoaXMuX2lucHV0LkxBKDEpO1xuXHRcdFx0XHR3aGlsZSAoX2xhPT09YmluZGluZ19ncmFtbWFyUGFyc2VyLlNFTUlDT0xPTikge1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0dGhpcy5zdGF0ZSA9IDUwO1xuXHRcdFx0XHRcdHRoaXMubWF0Y2goYmluZGluZ19ncmFtbWFyUGFyc2VyLlNFTUlDT0xPTik7XG5cdFx0XHRcdFx0dGhpcy5zdGF0ZSA9IDUxO1xuXHRcdFx0XHRcdHRoaXMudW5iaW5kaW5nX3N0YXRlbWVudCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5zdGF0ZSA9IDU2O1xuXHRcdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIuc3luYyh0aGlzKTtcblx0XHRcdFx0XHRfbGEgPSB0aGlzLl9pbnB1dC5MQSgxKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUkJSQUNFUzpcblx0XHRcdFx0e1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IE5vVmlhYmxlQWx0RXhjZXB0aW9uKHRoaXMpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5zdGF0ZSA9IDYwO1xuXHRcdFx0dGhpcy5tYXRjaChiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUkJSQUNFUyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNhdGNoIChyZSkge1xuXHRcdFx0aWYgKHJlIGluc3RhbmNlb2YgUmVjb2duaXRpb25FeGNlcHRpb24pIHtcblx0XHRcdFx0X2xvY2FsY3R4LmV4Y2VwdGlvbiA9IHJlO1xuXHRcdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnJlcG9ydEVycm9yKHRoaXMsIHJlKTtcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5yZWNvdmVyKHRoaXMsIHJlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IHJlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmaW5hbGx5IHtcblx0XHRcdHRoaXMuZXhpdFJ1bGUoKTtcblx0XHR9XG5cdFx0cmV0dXJuIF9sb2NhbGN0eDtcblx0fVxuXHRAUnVsZVZlcnNpb24oMClcblx0cHVibGljIGJpbmRpbmdfc3RhdGVtZW50KCk6IEJpbmRpbmdfc3RhdGVtZW50Q29udGV4dCB7XG5cdFx0bGV0IF9sb2NhbGN0eDogQmluZGluZ19zdGF0ZW1lbnRDb250ZXh0ID0gbmV3IEJpbmRpbmdfc3RhdGVtZW50Q29udGV4dCh0aGlzLl9jdHgsIHRoaXMuc3RhdGUpO1xuXHRcdHRoaXMuZW50ZXJSdWxlKF9sb2NhbGN0eCwgNiwgYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfYmluZGluZ19zdGF0ZW1lbnQpO1xuXHRcdGxldCBfbGE6IG51bWJlcjtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5zdGF0ZSA9IDc1O1xuXHRcdFx0dGhpcy5fZXJySGFuZGxlci5zeW5jKHRoaXMpO1xuXHRcdFx0c3dpdGNoICggdGhpcy5pbnRlcnByZXRlci5hZGFwdGl2ZVByZWRpY3QodGhpcy5faW5wdXQsNix0aGlzLl9jdHgpICkge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0aGlzLmVudGVyT3V0ZXJBbHQoX2xvY2FsY3R4LCAxKTtcblx0XHRcdFx0e1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gNjI7XG5cdFx0XHRcdHRoaXMuaXNfY3JlYXRvcigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRoaXMuZW50ZXJPdXRlckFsdChfbG9jYWxjdHgsIDIpO1xuXHRcdFx0XHR7XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSA2NDtcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5zeW5jKHRoaXMpO1xuXHRcdFx0XHRfbGEgPSB0aGlzLl9pbnB1dC5MQSgxKTtcblx0XHRcdFx0aWYgKF9sYT09PWJpbmRpbmdfZ3JhbW1hclBhcnNlci5VTkRFUikge1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLnN0YXRlID0gNjM7XG5cdFx0XHRcdFx0dGhpcy5zY29wZV9yZXN0cmljdGlvbigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuc3RhdGUgPSA2Njtcblx0XHRcdFx0dGhpcy5ub21pbmF0b3IoKTtcblx0XHRcdFx0dGhpcy5zdGF0ZSA9IDY3O1xuXHRcdFx0XHR0aGlzLm1hdGNoKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5OT01JTkFURVMpO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gNjg7XG5cdFx0XHRcdHRoaXMubm9taW5lZSgpO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gNzA7XG5cdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIuc3luYyh0aGlzKTtcblx0XHRcdFx0X2xhID0gdGhpcy5faW5wdXQuTEEoMSk7XG5cdFx0XHRcdGlmIChfbGE9PT1iaW5kaW5nX2dyYW1tYXJQYXJzZXIuSU4gfHwgX2xhPT09YmluZGluZ19ncmFtbWFyUGFyc2VyLk5PVCkge1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLnN0YXRlID0gNjk7XG5cdFx0XHRcdFx0dGhpcy5iaW5kaW5nX2NvbnN0cigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuc3RhdGUgPSA3Mztcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5zeW5jKHRoaXMpO1xuXHRcdFx0XHRfbGEgPSB0aGlzLl9pbnB1dC5MQSgxKTtcblx0XHRcdFx0aWYgKF9sYT09PWJpbmRpbmdfZ3JhbW1hclBhcnNlci5FTkRPUlNFRF9CWSkge1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLnN0YXRlID0gNzI7XG5cdFx0XHRcdFx0dGhpcy5lbmRvcnNlbWVudF9jb25zdHIoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjYXRjaCAocmUpIHtcblx0XHRcdGlmIChyZSBpbnN0YW5jZW9mIFJlY29nbml0aW9uRXhjZXB0aW9uKSB7XG5cdFx0XHRcdF9sb2NhbGN0eC5leGNlcHRpb24gPSByZTtcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5yZXBvcnRFcnJvcih0aGlzLCByZSk7XG5cdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIucmVjb3Zlcih0aGlzLCByZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyByZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZmluYWxseSB7XG5cdFx0XHR0aGlzLmV4aXRSdWxlKCk7XG5cdFx0fVxuXHRcdHJldHVybiBfbG9jYWxjdHg7XG5cdH1cblx0QFJ1bGVWZXJzaW9uKDApXG5cdHB1YmxpYyB1bmJpbmRpbmdfc3RhdGVtZW50KCk6IFVuYmluZGluZ19zdGF0ZW1lbnRDb250ZXh0IHtcblx0XHRsZXQgX2xvY2FsY3R4OiBVbmJpbmRpbmdfc3RhdGVtZW50Q29udGV4dCA9IG5ldyBVbmJpbmRpbmdfc3RhdGVtZW50Q29udGV4dCh0aGlzLl9jdHgsIHRoaXMuc3RhdGUpO1xuXHRcdHRoaXMuZW50ZXJSdWxlKF9sb2NhbGN0eCwgOCwgYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfdW5iaW5kaW5nX3N0YXRlbWVudCk7XG5cdFx0bGV0IF9sYTogbnVtYmVyO1xuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmVudGVyT3V0ZXJBbHQoX2xvY2FsY3R4LCAxKTtcblx0XHRcdHtcblx0XHRcdHRoaXMuc3RhdGUgPSA3Nztcblx0XHRcdHRoaXMubm9taW5hdG9yKCk7XG5cdFx0XHR0aGlzLnN0YXRlID0gNzg7XG5cdFx0XHR0aGlzLm1hdGNoKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5SRUxFQVNFUyk7XG5cdFx0XHR0aGlzLnN0YXRlID0gNzk7XG5cdFx0XHR0aGlzLm5vbWluZWUoKTtcblx0XHRcdHRoaXMuc3RhdGUgPSA4MTtcblx0XHRcdHRoaXMuX2VyckhhbmRsZXIuc3luYyh0aGlzKTtcblx0XHRcdF9sYSA9IHRoaXMuX2lucHV0LkxBKDEpO1xuXHRcdFx0aWYgKF9sYT09PWJpbmRpbmdfZ3JhbW1hclBhcnNlci5JTiB8fCBfbGE9PT1iaW5kaW5nX2dyYW1tYXJQYXJzZXIuTk9UKSB7XG5cdFx0XHRcdHtcblx0XHRcdFx0dGhpcy5zdGF0ZSA9IDgwO1xuXHRcdFx0XHR0aGlzLmJpbmRpbmdfY29uc3RyKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dGhpcy5zdGF0ZSA9IDg0O1xuXHRcdFx0dGhpcy5fZXJySGFuZGxlci5zeW5jKHRoaXMpO1xuXHRcdFx0X2xhID0gdGhpcy5faW5wdXQuTEEoMSk7XG5cdFx0XHRpZiAoX2xhPT09YmluZGluZ19ncmFtbWFyUGFyc2VyLkVORE9SU0VEX0JZKSB7XG5cdFx0XHRcdHtcblx0XHRcdFx0dGhpcy5zdGF0ZSA9IDgzO1xuXHRcdFx0XHR0aGlzLmVuZG9yc2VtZW50X2NvbnN0cigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG5cdFx0Y2F0Y2ggKHJlKSB7XG5cdFx0XHRpZiAocmUgaW5zdGFuY2VvZiBSZWNvZ25pdGlvbkV4Y2VwdGlvbikge1xuXHRcdFx0XHRfbG9jYWxjdHguZXhjZXB0aW9uID0gcmU7XG5cdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIucmVwb3J0RXJyb3IodGhpcywgcmUpO1xuXHRcdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnJlY292ZXIodGhpcywgcmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgcmU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZpbmFsbHkge1xuXHRcdFx0dGhpcy5leGl0UnVsZSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gX2xvY2FsY3R4O1xuXHR9XG5cdEBSdWxlVmVyc2lvbigwKVxuXHRwdWJsaWMgaXNfY3JlYXRvcigpOiBJc19jcmVhdG9yQ29udGV4dCB7XG5cdFx0bGV0IF9sb2NhbGN0eDogSXNfY3JlYXRvckNvbnRleHQgPSBuZXcgSXNfY3JlYXRvckNvbnRleHQodGhpcy5fY3R4LCB0aGlzLnN0YXRlKTtcblx0XHR0aGlzLmVudGVyUnVsZShfbG9jYWxjdHgsIDEwLCBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUlVMRV9pc19jcmVhdG9yKTtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5lbnRlck91dGVyQWx0KF9sb2NhbGN0eCwgMSk7XG5cdFx0XHR7XG5cdFx0XHR0aGlzLnN0YXRlID0gODY7XG5cdFx0XHR0aGlzLnJvbGUoKTtcblx0XHRcdHRoaXMuc3RhdGUgPSA4Nztcblx0XHRcdHRoaXMubWF0Y2goYmluZGluZ19ncmFtbWFyUGFyc2VyLklTKTtcblx0XHRcdHRoaXMuc3RhdGUgPSA4ODtcblx0XHRcdHRoaXMubWF0Y2goYmluZGluZ19ncmFtbWFyUGFyc2VyLkNBU0VfQ1JFQVRPUik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNhdGNoIChyZSkge1xuXHRcdFx0aWYgKHJlIGluc3RhbmNlb2YgUmVjb2duaXRpb25FeGNlcHRpb24pIHtcblx0XHRcdFx0X2xvY2FsY3R4LmV4Y2VwdGlvbiA9IHJlO1xuXHRcdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnJlcG9ydEVycm9yKHRoaXMsIHJlKTtcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5yZWNvdmVyKHRoaXMsIHJlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IHJlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmaW5hbGx5IHtcblx0XHRcdHRoaXMuZXhpdFJ1bGUoKTtcblx0XHR9XG5cdFx0cmV0dXJuIF9sb2NhbGN0eDtcblx0fVxuXHRAUnVsZVZlcnNpb24oMClcblx0cHVibGljIGJpbmRpbmdfY29uc3RyKCk6IEJpbmRpbmdfY29uc3RyQ29udGV4dCB7XG5cdFx0bGV0IF9sb2NhbGN0eDogQmluZGluZ19jb25zdHJDb250ZXh0ID0gbmV3IEJpbmRpbmdfY29uc3RyQ29udGV4dCh0aGlzLl9jdHgsIHRoaXMuc3RhdGUpO1xuXHRcdHRoaXMuZW50ZXJSdWxlKF9sb2NhbGN0eCwgMTIsIGJpbmRpbmdfZ3JhbW1hclBhcnNlci5SVUxFX2JpbmRpbmdfY29uc3RyKTtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5zdGF0ZSA9IDk1O1xuXHRcdFx0dGhpcy5fZXJySGFuZGxlci5zeW5jKHRoaXMpO1xuXHRcdFx0c3dpdGNoICh0aGlzLl9pbnB1dC5MQSgxKSkge1xuXHRcdFx0Y2FzZSBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuTk9UOlxuXHRcdFx0XHR0aGlzLmVudGVyT3V0ZXJBbHQoX2xvY2FsY3R4LCAxKTtcblx0XHRcdFx0e1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gOTA7XG5cdFx0XHRcdHRoaXMubWF0Y2goYmluZGluZ19ncmFtbWFyUGFyc2VyLk5PVCk7XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSA5MTtcblx0XHRcdFx0dGhpcy5tYXRjaChiaW5kaW5nX2dyYW1tYXJQYXJzZXIuSU4pO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gOTI7XG5cdFx0XHRcdHRoaXMuc2V0X2V4cHJlc2lvbigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuSU46XG5cdFx0XHRcdHRoaXMuZW50ZXJPdXRlckFsdChfbG9jYWxjdHgsIDIpO1xuXHRcdFx0XHR7XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSA5Mztcblx0XHRcdFx0dGhpcy5tYXRjaChiaW5kaW5nX2dyYW1tYXJQYXJzZXIuSU4pO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gOTQ7XG5cdFx0XHRcdHRoaXMuc2V0X2V4cHJlc2lvbigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IE5vVmlhYmxlQWx0RXhjZXB0aW9uKHRoaXMpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjYXRjaCAocmUpIHtcblx0XHRcdGlmIChyZSBpbnN0YW5jZW9mIFJlY29nbml0aW9uRXhjZXB0aW9uKSB7XG5cdFx0XHRcdF9sb2NhbGN0eC5leGNlcHRpb24gPSByZTtcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5yZXBvcnRFcnJvcih0aGlzLCByZSk7XG5cdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIucmVjb3Zlcih0aGlzLCByZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyByZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZmluYWxseSB7XG5cdFx0XHR0aGlzLmV4aXRSdWxlKCk7XG5cdFx0fVxuXHRcdHJldHVybiBfbG9jYWxjdHg7XG5cdH1cblx0QFJ1bGVWZXJzaW9uKDApXG5cdHB1YmxpYyBlbmRvcnNlbWVudF9jb25zdHIoKTogRW5kb3JzZW1lbnRfY29uc3RyQ29udGV4dCB7XG5cdFx0bGV0IF9sb2NhbGN0eDogRW5kb3JzZW1lbnRfY29uc3RyQ29udGV4dCA9IG5ldyBFbmRvcnNlbWVudF9jb25zdHJDb250ZXh0KHRoaXMuX2N0eCwgdGhpcy5zdGF0ZSk7XG5cdFx0dGhpcy5lbnRlclJ1bGUoX2xvY2FsY3R4LCAxNCwgYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfZW5kb3JzZW1lbnRfY29uc3RyKTtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5lbnRlck91dGVyQWx0KF9sb2NhbGN0eCwgMSk7XG5cdFx0XHR7XG5cdFx0XHR0aGlzLnN0YXRlID0gOTc7XG5cdFx0XHR0aGlzLm1hdGNoKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5FTkRPUlNFRF9CWSk7XG5cdFx0XHR0aGlzLnN0YXRlID0gOTg7XG5cdFx0XHR0aGlzLnNldF9leHByZXNpb24oKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y2F0Y2ggKHJlKSB7XG5cdFx0XHRpZiAocmUgaW5zdGFuY2VvZiBSZWNvZ25pdGlvbkV4Y2VwdGlvbikge1xuXHRcdFx0XHRfbG9jYWxjdHguZXhjZXB0aW9uID0gcmU7XG5cdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIucmVwb3J0RXJyb3IodGhpcywgcmUpO1xuXHRcdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnJlY292ZXIodGhpcywgcmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgcmU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZpbmFsbHkge1xuXHRcdFx0dGhpcy5leGl0UnVsZSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gX2xvY2FsY3R4O1xuXHR9XG5cdEBSdWxlVmVyc2lvbigwKVxuXHRwdWJsaWMgc2V0X2V4cHJlc2lvbigpOiBTZXRfZXhwcmVzaW9uQ29udGV4dCB7XG5cdFx0bGV0IF9sb2NhbGN0eDogU2V0X2V4cHJlc2lvbkNvbnRleHQgPSBuZXcgU2V0X2V4cHJlc2lvbkNvbnRleHQodGhpcy5fY3R4LCB0aGlzLnN0YXRlKTtcblx0XHR0aGlzLmVudGVyUnVsZShfbG9jYWxjdHgsIDE2LCBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUlVMRV9zZXRfZXhwcmVzaW9uKTtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5zdGF0ZSA9IDExMztcblx0XHRcdHRoaXMuX2VyckhhbmRsZXIuc3luYyh0aGlzKTtcblx0XHRcdHN3aXRjaCAoIHRoaXMuaW50ZXJwcmV0ZXIuYWRhcHRpdmVQcmVkaWN0KHRoaXMuX2lucHV0LDEwLHRoaXMuX2N0eCkgKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRoaXMuZW50ZXJPdXRlckFsdChfbG9jYWxjdHgsIDEpO1xuXHRcdFx0XHR7XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSAxMDA7XG5cdFx0XHRcdHRoaXMubWF0Y2goYmluZGluZ19ncmFtbWFyUGFyc2VyLkxQQVJFTik7XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSAxMDE7XG5cdFx0XHRcdHRoaXMuc2V0X2V4cHJlc2lvbigpO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gMTAyO1xuXHRcdFx0XHR0aGlzLm1hdGNoKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5SUEFSRU4pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRoaXMuZW50ZXJPdXRlckFsdChfbG9jYWxjdHgsIDIpO1xuXHRcdFx0XHR7XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSAxMDQ7XG5cdFx0XHRcdHRoaXMucm9sZSgpO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gMTA1O1xuXHRcdFx0XHR0aGlzLm1hdGNoKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5PUik7XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSAxMDY7XG5cdFx0XHRcdHRoaXMuc2V0X2V4cHJlc2lvbigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDM6XG5cdFx0XHRcdHRoaXMuZW50ZXJPdXRlckFsdChfbG9jYWxjdHgsIDMpO1xuXHRcdFx0XHR7XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSAxMDg7XG5cdFx0XHRcdHRoaXMucm9sZSgpO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gMTA5O1xuXHRcdFx0XHR0aGlzLm1hdGNoKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5BTkQpO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gMTEwO1xuXHRcdFx0XHR0aGlzLnNldF9leHByZXNpb24oKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHR0aGlzLmVudGVyT3V0ZXJBbHQoX2xvY2FsY3R4LCA0KTtcblx0XHRcdFx0e1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gMTEyO1xuXHRcdFx0XHR0aGlzLnJvbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0Y2F0Y2ggKHJlKSB7XG5cdFx0XHRpZiAocmUgaW5zdGFuY2VvZiBSZWNvZ25pdGlvbkV4Y2VwdGlvbikge1xuXHRcdFx0XHRfbG9jYWxjdHguZXhjZXB0aW9uID0gcmU7XG5cdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIucmVwb3J0RXJyb3IodGhpcywgcmUpO1xuXHRcdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnJlY292ZXIodGhpcywgcmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgcmU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZpbmFsbHkge1xuXHRcdFx0dGhpcy5leGl0UnVsZSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gX2xvY2FsY3R4O1xuXHR9XG5cdEBSdWxlVmVyc2lvbigwKVxuXHRwdWJsaWMgc2NvcGVfcmVzdHJpY3Rpb24oKTogU2NvcGVfcmVzdHJpY3Rpb25Db250ZXh0IHtcblx0XHRsZXQgX2xvY2FsY3R4OiBTY29wZV9yZXN0cmljdGlvbkNvbnRleHQgPSBuZXcgU2NvcGVfcmVzdHJpY3Rpb25Db250ZXh0KHRoaXMuX2N0eCwgdGhpcy5zdGF0ZSk7XG5cdFx0dGhpcy5lbnRlclJ1bGUoX2xvY2FsY3R4LCAxOCwgYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfc2NvcGVfcmVzdHJpY3Rpb24pO1xuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmVudGVyT3V0ZXJBbHQoX2xvY2FsY3R4LCAxKTtcblx0XHRcdHtcblx0XHRcdHRoaXMuc3RhdGUgPSAxMTU7XG5cdFx0XHR0aGlzLm1hdGNoKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5VTkRFUik7XG5cdFx0XHR0aGlzLnN0YXRlID0gMTE2O1xuXHRcdFx0dGhpcy5zdWJwcm9jZXNzX2lkKCk7XG5cdFx0XHR0aGlzLnN0YXRlID0gMTE3O1xuXHRcdFx0dGhpcy5tYXRjaChiaW5kaW5nX2dyYW1tYXJQYXJzZXIuQ09NTUEpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjYXRjaCAocmUpIHtcblx0XHRcdGlmIChyZSBpbnN0YW5jZW9mIFJlY29nbml0aW9uRXhjZXB0aW9uKSB7XG5cdFx0XHRcdF9sb2NhbGN0eC5leGNlcHRpb24gPSByZTtcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5yZXBvcnRFcnJvcih0aGlzLCByZSk7XG5cdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIucmVjb3Zlcih0aGlzLCByZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyByZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZmluYWxseSB7XG5cdFx0XHR0aGlzLmV4aXRSdWxlKCk7XG5cdFx0fVxuXHRcdHJldHVybiBfbG9jYWxjdHg7XG5cdH1cblx0QFJ1bGVWZXJzaW9uKDApXG5cdHB1YmxpYyBub21pbmF0b3IoKTogTm9taW5hdG9yQ29udGV4dCB7XG5cdFx0bGV0IF9sb2NhbGN0eDogTm9taW5hdG9yQ29udGV4dCA9IG5ldyBOb21pbmF0b3JDb250ZXh0KHRoaXMuX2N0eCwgdGhpcy5zdGF0ZSk7XG5cdFx0dGhpcy5lbnRlclJ1bGUoX2xvY2FsY3R4LCAyMCwgYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfbm9taW5hdG9yKTtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5lbnRlck91dGVyQWx0KF9sb2NhbGN0eCwgMSk7XG5cdFx0XHR7XG5cdFx0XHR0aGlzLnN0YXRlID0gMTE5O1xuXHRcdFx0dGhpcy5yb2xlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNhdGNoIChyZSkge1xuXHRcdFx0aWYgKHJlIGluc3RhbmNlb2YgUmVjb2duaXRpb25FeGNlcHRpb24pIHtcblx0XHRcdFx0X2xvY2FsY3R4LmV4Y2VwdGlvbiA9IHJlO1xuXHRcdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnJlcG9ydEVycm9yKHRoaXMsIHJlKTtcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5yZWNvdmVyKHRoaXMsIHJlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IHJlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmaW5hbGx5IHtcblx0XHRcdHRoaXMuZXhpdFJ1bGUoKTtcblx0XHR9XG5cdFx0cmV0dXJuIF9sb2NhbGN0eDtcblx0fVxuXHRAUnVsZVZlcnNpb24oMClcblx0cHVibGljIG5vbWluZWUoKTogTm9taW5lZUNvbnRleHQge1xuXHRcdGxldCBfbG9jYWxjdHg6IE5vbWluZWVDb250ZXh0ID0gbmV3IE5vbWluZWVDb250ZXh0KHRoaXMuX2N0eCwgdGhpcy5zdGF0ZSk7XG5cdFx0dGhpcy5lbnRlclJ1bGUoX2xvY2FsY3R4LCAyMiwgYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfbm9taW5lZSk7XG5cdFx0dHJ5IHtcblx0XHRcdHRoaXMuZW50ZXJPdXRlckFsdChfbG9jYWxjdHgsIDEpO1xuXHRcdFx0e1xuXHRcdFx0dGhpcy5zdGF0ZSA9IDEyMTtcblx0XHRcdHRoaXMucm9sZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjYXRjaCAocmUpIHtcblx0XHRcdGlmIChyZSBpbnN0YW5jZW9mIFJlY29nbml0aW9uRXhjZXB0aW9uKSB7XG5cdFx0XHRcdF9sb2NhbGN0eC5leGNlcHRpb24gPSByZTtcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5yZXBvcnRFcnJvcih0aGlzLCByZSk7XG5cdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIucmVjb3Zlcih0aGlzLCByZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyByZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZmluYWxseSB7XG5cdFx0XHR0aGlzLmV4aXRSdWxlKCk7XG5cdFx0fVxuXHRcdHJldHVybiBfbG9jYWxjdHg7XG5cdH1cblx0QFJ1bGVWZXJzaW9uKDApXG5cdHB1YmxpYyByb2xlKCk6IFJvbGVDb250ZXh0IHtcblx0XHRsZXQgX2xvY2FsY3R4OiBSb2xlQ29udGV4dCA9IG5ldyBSb2xlQ29udGV4dCh0aGlzLl9jdHgsIHRoaXMuc3RhdGUpO1xuXHRcdHRoaXMuZW50ZXJSdWxlKF9sb2NhbGN0eCwgMjQsIGJpbmRpbmdfZ3JhbW1hclBhcnNlci5SVUxFX3JvbGUpO1xuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmVudGVyT3V0ZXJBbHQoX2xvY2FsY3R4LCAxKTtcblx0XHRcdHtcblx0XHRcdHRoaXMuc3RhdGUgPSAxMjY7XG5cdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnN5bmModGhpcyk7XG5cdFx0XHRzd2l0Y2ggKCB0aGlzLmludGVycHJldGVyLmFkYXB0aXZlUHJlZGljdCh0aGlzLl9pbnB1dCwxMSx0aGlzLl9jdHgpICkge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR7XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSAxMjM7XG5cdFx0XHRcdHRoaXMucm9sZV9pZCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHtcblx0XHRcdFx0dGhpcy5zdGF0ZSA9IDEyNDtcblx0XHRcdFx0dGhpcy5yb2xlX3BhdGhfZXhwcmVzaW9uKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0e1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gMTI1O1xuXHRcdFx0XHR0aGlzLm1hdGNoKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5TRUxGKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0Y2F0Y2ggKHJlKSB7XG5cdFx0XHRpZiAocmUgaW5zdGFuY2VvZiBSZWNvZ25pdGlvbkV4Y2VwdGlvbikge1xuXHRcdFx0XHRfbG9jYWxjdHguZXhjZXB0aW9uID0gcmU7XG5cdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIucmVwb3J0RXJyb3IodGhpcywgcmUpO1xuXHRcdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnJlY292ZXIodGhpcywgcmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgcmU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZpbmFsbHkge1xuXHRcdFx0dGhpcy5leGl0UnVsZSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gX2xvY2FsY3R4O1xuXHR9XG5cdEBSdWxlVmVyc2lvbigwKVxuXHRwdWJsaWMgcm9sZV9wYXRoX2V4cHJlc2lvbigpOiBSb2xlX3BhdGhfZXhwcmVzaW9uQ29udGV4dCB7XG5cdFx0bGV0IF9sb2NhbGN0eDogUm9sZV9wYXRoX2V4cHJlc2lvbkNvbnRleHQgPSBuZXcgUm9sZV9wYXRoX2V4cHJlc2lvbkNvbnRleHQodGhpcy5fY3R4LCB0aGlzLnN0YXRlKTtcblx0XHR0aGlzLmVudGVyUnVsZShfbG9jYWxjdHgsIDI2LCBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUlVMRV9yb2xlX3BhdGhfZXhwcmVzaW9uKTtcblx0XHR0cnkge1xuXHRcdFx0bGV0IF9hbHQ6IG51bWJlcjtcblx0XHRcdHRoaXMuZW50ZXJPdXRlckFsdChfbG9jYWxjdHgsIDEpO1xuXHRcdFx0e1xuXHRcdFx0dGhpcy5zdGF0ZSA9IDEzMTsgXG5cdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnN5bmModGhpcyk7XG5cdFx0XHRfYWx0ID0gMTtcblx0XHRcdGRvIHtcblx0XHRcdFx0c3dpdGNoIChfYWx0KSB7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdHRoaXMuc3RhdGUgPSAxMjg7XG5cdFx0XHRcdFx0dGhpcy5zdWJwcm9jZXNzX2lkKCk7XG5cdFx0XHRcdFx0dGhpcy5zdGF0ZSA9IDEyOTtcblx0XHRcdFx0XHR0aGlzLm1hdGNoKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5ET1QpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IE5vVmlhYmxlQWx0RXhjZXB0aW9uKHRoaXMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSAxMzM7IFxuXHRcdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnN5bmModGhpcyk7XG5cdFx0XHRcdF9hbHQgPSB0aGlzLmludGVycHJldGVyLmFkYXB0aXZlUHJlZGljdCh0aGlzLl9pbnB1dCwxMix0aGlzLl9jdHgpO1xuXHRcdFx0fSB3aGlsZSAoIF9hbHQhPT0yICYmIF9hbHQhPT1BVE4uSU5WQUxJRF9BTFRfTlVNQkVSICk7XG5cdFx0XHR0aGlzLnN0YXRlID0gMTM1O1xuXHRcdFx0dGhpcy5yb2xlX2lkKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNhdGNoIChyZSkge1xuXHRcdFx0aWYgKHJlIGluc3RhbmNlb2YgUmVjb2duaXRpb25FeGNlcHRpb24pIHtcblx0XHRcdFx0X2xvY2FsY3R4LmV4Y2VwdGlvbiA9IHJlO1xuXHRcdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnJlcG9ydEVycm9yKHRoaXMsIHJlKTtcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5yZWNvdmVyKHRoaXMsIHJlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IHJlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmaW5hbGx5IHtcblx0XHRcdHRoaXMuZXhpdFJ1bGUoKTtcblx0XHR9XG5cdFx0cmV0dXJuIF9sb2NhbGN0eDtcblx0fVxuXHRAUnVsZVZlcnNpb24oMClcblx0cHVibGljIHN1YnByb2Nlc3NfaWQoKTogU3VicHJvY2Vzc19pZENvbnRleHQge1xuXHRcdGxldCBfbG9jYWxjdHg6IFN1YnByb2Nlc3NfaWRDb250ZXh0ID0gbmV3IFN1YnByb2Nlc3NfaWRDb250ZXh0KHRoaXMuX2N0eCwgdGhpcy5zdGF0ZSk7XG5cdFx0dGhpcy5lbnRlclJ1bGUoX2xvY2FsY3R4LCAyOCwgYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfc3VicHJvY2Vzc19pZCk7XG5cdFx0dHJ5IHtcblx0XHRcdHRoaXMuZW50ZXJPdXRlckFsdChfbG9jYWxjdHgsIDEpO1xuXHRcdFx0e1xuXHRcdFx0dGhpcy5zdGF0ZSA9IDEzNztcblx0XHRcdHRoaXMubWF0Y2goYmluZGluZ19ncmFtbWFyUGFyc2VyLklERU5USUZJRVIpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjYXRjaCAocmUpIHtcblx0XHRcdGlmIChyZSBpbnN0YW5jZW9mIFJlY29nbml0aW9uRXhjZXB0aW9uKSB7XG5cdFx0XHRcdF9sb2NhbGN0eC5leGNlcHRpb24gPSByZTtcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5yZXBvcnRFcnJvcih0aGlzLCByZSk7XG5cdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIucmVjb3Zlcih0aGlzLCByZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyByZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZmluYWxseSB7XG5cdFx0XHR0aGlzLmV4aXRSdWxlKCk7XG5cdFx0fVxuXHRcdHJldHVybiBfbG9jYWxjdHg7XG5cdH1cblx0QFJ1bGVWZXJzaW9uKDApXG5cdHB1YmxpYyByb2xlX2lkKCk6IFJvbGVfaWRDb250ZXh0IHtcblx0XHRsZXQgX2xvY2FsY3R4OiBSb2xlX2lkQ29udGV4dCA9IG5ldyBSb2xlX2lkQ29udGV4dCh0aGlzLl9jdHgsIHRoaXMuc3RhdGUpO1xuXHRcdHRoaXMuZW50ZXJSdWxlKF9sb2NhbGN0eCwgMzAsIGJpbmRpbmdfZ3JhbW1hclBhcnNlci5SVUxFX3JvbGVfaWQpO1xuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmVudGVyT3V0ZXJBbHQoX2xvY2FsY3R4LCAxKTtcblx0XHRcdHtcblx0XHRcdHRoaXMuc3RhdGUgPSAxMzk7XG5cdFx0XHR0aGlzLm1hdGNoKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5JREVOVElGSUVSKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y2F0Y2ggKHJlKSB7XG5cdFx0XHRpZiAocmUgaW5zdGFuY2VvZiBSZWNvZ25pdGlvbkV4Y2VwdGlvbikge1xuXHRcdFx0XHRfbG9jYWxjdHguZXhjZXB0aW9uID0gcmU7XG5cdFx0XHRcdHRoaXMuX2VyckhhbmRsZXIucmVwb3J0RXJyb3IodGhpcywgcmUpO1xuXHRcdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnJlY292ZXIodGhpcywgcmUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgcmU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZpbmFsbHkge1xuXHRcdFx0dGhpcy5leGl0UnVsZSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gX2xvY2FsY3R4O1xuXHR9XG5cdEBSdWxlVmVyc2lvbigwKVxuXHRwdWJsaWMgdGFza19pZCgpOiBUYXNrX2lkQ29udGV4dCB7XG5cdFx0bGV0IF9sb2NhbGN0eDogVGFza19pZENvbnRleHQgPSBuZXcgVGFza19pZENvbnRleHQodGhpcy5fY3R4LCB0aGlzLnN0YXRlKTtcblx0XHR0aGlzLmVudGVyUnVsZShfbG9jYWxjdHgsIDMyLCBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUlVMRV90YXNrX2lkKTtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5lbnRlck91dGVyQWx0KF9sb2NhbGN0eCwgMSk7XG5cdFx0XHR7XG5cdFx0XHR0aGlzLnN0YXRlID0gMTQxO1xuXHRcdFx0dGhpcy5tYXRjaChiaW5kaW5nX2dyYW1tYXJQYXJzZXIuSURFTlRJRklFUik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNhdGNoIChyZSkge1xuXHRcdFx0aWYgKHJlIGluc3RhbmNlb2YgUmVjb2duaXRpb25FeGNlcHRpb24pIHtcblx0XHRcdFx0X2xvY2FsY3R4LmV4Y2VwdGlvbiA9IHJlO1xuXHRcdFx0XHR0aGlzLl9lcnJIYW5kbGVyLnJlcG9ydEVycm9yKHRoaXMsIHJlKTtcblx0XHRcdFx0dGhpcy5fZXJySGFuZGxlci5yZWNvdmVyKHRoaXMsIHJlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IHJlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmaW5hbGx5IHtcblx0XHRcdHRoaXMuZXhpdFJ1bGUoKTtcblx0XHR9XG5cdFx0cmV0dXJuIF9sb2NhbGN0eDtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgX3NlcmlhbGl6ZWRBVE46IHN0cmluZyA9XG5cdFx0XCJcXHgwM1xcdUFGNkZcXHU4MzIwXFx1NDc5RFxcdUI3NUNcXHU0ODgwXFx1MTYwNVxcdTE5MUNcXHVBQjM3XFx4MDNcXHgxNlxceDkyXFx4MDRcXHgwMlwiK1xuXHRcdFwiXFx0XFx4MDJcXHgwNFxceDAzXFx0XFx4MDNcXHgwNFxceDA0XFx0XFx4MDRcXHgwNFxceDA1XFx0XFx4MDVcXHgwNFxceDA2XFx0XFx4MDZcXHgwNFxceDA3XCIrXG5cdFx0XCJcXHRcXHgwN1xceDA0XFxiXFx0XFxiXFx4MDRcXHRcXHRcXHRcXHgwNFxcblxcdFxcblxceDA0XFx2XFx0XFx2XFx4MDRcXGZcXHRcXGZcXHgwNFxcclxcdFxcclxceDA0XCIrXG5cdFx0XCJcXHgwRVxcdFxceDBFXFx4MDRcXHgwRlxcdFxceDBGXFx4MDRcXHgxMFxcdFxceDEwXFx4MDRcXHgxMVxcdFxceDExXFx4MDRcXHgxMlxcdFxceDEyXFx4MDNcIitcblx0XHRcIlxceDAyXFx4MDNcXHgwMlxceDAzXFx4MDJcXHgwM1xceDAzXFx4MDNcXHgwM1xceDAzXFx4MDNcXHgwM1xceDAzXFx4MDdcXHgwMyxcXG5cXHgwM1xcZlwiK1xuXHRcdFwiXFx4MDNcXHgwRVxceDAzL1xcdlxceDAzXFx4MDNcXHgwM1xceDAzXFx4MDNcXHgwM1xceDA0XFx4MDNcXHgwNFxceDAzXFx4MDRcXHgwM1xceDA0XFx4MDdcIitcblx0XHRcIlxceDA0N1xcblxceDA0XFxmXFx4MDRcXHgwRVxceDA0OlxcdlxceDA0XFx4MDNcXHgwNFxceDA1XFx4MDQ9XFxuXFx4MDRcXHgwM1xceDA0XFx4MDNcXHgwNFwiK1xuXHRcdFwiXFx4MDNcXHgwNVxceDAzXFx4MDVcXHgwNVxceDA1Q1xcblxceDA1XFx4MDNcXHgwNVxceDAzXFx4MDVcXHgwM1xceDA1XFx4MDNcXHgwNVxceDA1XFx4MDVcIitcblx0XHRcIklcXG5cXHgwNVxceDAzXFx4MDVcXHgwNVxceDA1TFxcblxceDA1XFx4MDVcXHgwNU5cXG5cXHgwNVxceDAzXFx4MDZcXHgwM1xceDA2XFx4MDNcXHgwNlwiK1xuXHRcdFwiXFx4MDNcXHgwNlxceDA1XFx4MDZUXFxuXFx4MDZcXHgwM1xceDA2XFx4MDVcXHgwNldcXG5cXHgwNlxceDAzXFx4MDdcXHgwM1xceDA3XFx4MDNcXHgwN1wiK1xuXHRcdFwiXFx4MDNcXHgwN1xceDAzXFxiXFx4MDNcXGJcXHgwM1xcYlxceDAzXFxiXFx4MDNcXGJcXHgwNVxcYmJcXG5cXGJcXHgwM1xcdFxceDAzXFx0XFx4MDNcXHRcXHgwM1wiK1xuXHRcdFwiXFxuXFx4MDNcXG5cXHgwM1xcblxceDAzXFxuXFx4MDNcXG5cXHgwM1xcblxceDAzXFxuXFx4MDNcXG5cXHgwM1xcblxceDAzXFxuXFx4MDNcXG5cXHgwM1xcblxceDAzXCIrXG5cdFx0XCJcXG5cXHgwNVxcbnRcXG5cXG5cXHgwM1xcdlxceDAzXFx2XFx4MDNcXHZcXHgwM1xcdlxceDAzXFxmXFx4MDNcXGZcXHgwM1xcclxceDAzXFxyXFx4MDNcXHgwRVwiK1xuXHRcdFwiXFx4MDNcXHgwRVxceDAzXFx4MEVcXHgwNVxceDBFXFx4ODFcXG5cXHgwRVxceDAzXFx4MEZcXHgwM1xceDBGXFx4MDNcXHgwRlxceDA2XFx4MEZcXHg4NlwiK1xuXHRcdFwiXFxuXFx4MEZcXHJcXHgwRlxceDBFXFx4MEZcXHg4N1xceDAzXFx4MEZcXHgwM1xceDBGXFx4MDNcXHgxMFxceDAzXFx4MTBcXHgwM1xceDExXFx4MDNcXHgxMVwiK1xuXHRcdFwiXFx4MDNcXHgxMlxceDAzXFx4MTJcXHgwM1xceDEyXFx4MDJcXHgwMlxceDAyXFx4MTNcXHgwMlxceDAyXFx4MDRcXHgwMlxceDA2XFx4MDJcXGJcXHgwMlwiK1xuXHRcdFwiXFxuXFx4MDJcXGZcXHgwMlxceDBFXFx4MDJcXHgxMFxceDAyXFx4MTJcXHgwMlxceDE0XFx4MDJcXHgxNlxceDAyXFx4MThcXHgwMlxceDFBXFx4MDJcXHgxQ1wiK1xuXHRcdFwiXFx4MDJcXHgxRVxceDAyIFxceDAyXFxcIlxceDAyXFx4MDJcXHgwMlxceDkwXFx4MDIkXFx4MDNcXHgwMlxceDAyXFx4MDJcXHgwNFxcJ1xceDAzXFx4MDJcIitcblx0XHRcIlxceDAyXFx4MDJcXHgwNjJcXHgwM1xceDAyXFx4MDJcXHgwMlxcYk1cXHgwM1xceDAyXFx4MDJcXHgwMlxcbk9cXHgwM1xceDAyXFx4MDJcXHgwMlxcZlwiK1xuXHRcdFwiWFxceDAzXFx4MDJcXHgwMlxceDAyXFx4MEVhXFx4MDNcXHgwMlxceDAyXFx4MDJcXHgxMGNcXHgwM1xceDAyXFx4MDJcXHgwMlxceDEyc1xceDAzXFx4MDJcIitcblx0XHRcIlxceDAyXFx4MDJcXHgxNHVcXHgwM1xceDAyXFx4MDJcXHgwMlxceDE2eVxceDAzXFx4MDJcXHgwMlxceDAyXFx4MTh7XFx4MDNcXHgwMlxceDAyXFx4MDJcIitcblx0XHRcIlxceDFBXFx4ODBcXHgwM1xceDAyXFx4MDJcXHgwMlxceDFDXFx4ODVcXHgwM1xceDAyXFx4MDJcXHgwMlxceDFFXFx4OEJcXHgwM1xceDAyXFx4MDJcXHgwMlwiK1xuXHRcdFwiIFxceDhEXFx4MDNcXHgwMlxceDAyXFx4MDJcXFwiXFx4OEZcXHgwM1xceDAyXFx4MDJcXHgwMiQlXFx4MDVcXHgwNFxceDAzXFx4MDIlJlxceDA1XFx4MDZcIitcblx0XHRcIlxceDA0XFx4MDImXFx4MDNcXHgwM1xceDAyXFx4MDJcXHgwMlxcJyhcXHgwN1xceDEzXFx4MDJcXHgwMigtXFx4MDVcXGJcXHgwNVxceDAyKSpcXHgwN1wiK1xuXHRcdFwiXFx4MTBcXHgwMlxceDAyKixcXHgwNVxcYlxceDA1XFx4MDIrKVxceDAzXFx4MDJcXHgwMlxceDAyLC9cXHgwM1xceDAyXFx4MDJcXHgwMi0rXFx4MDNcIitcblx0XHRcIlxceDAyXFx4MDJcXHgwMi0uXFx4MDNcXHgwMlxceDAyXFx4MDIuMFxceDAzXFx4MDJcXHgwMlxceDAyLy1cXHgwM1xceDAyXFx4MDJcXHgwMjAxXFx4MDdcIitcblx0XHRcIlxceDE0XFx4MDJcXHgwMjFcXHgwNVxceDAzXFx4MDJcXHgwMlxceDAyMjxcXHgwN1xceDEzXFx4MDJcXHgwMjM4XFx4MDVcXG5cXHgwNlxceDAyNDVcIitcblx0XHRcIlxceDA3XFx4MTBcXHgwMlxceDAyNTdcXHgwNVxcblxceDA2XFx4MDI2NFxceDAzXFx4MDJcXHgwMlxceDAyNzpcXHgwM1xceDAyXFx4MDJcXHgwMjhcIitcblx0XHRcIjZcXHgwM1xceDAyXFx4MDJcXHgwMjg5XFx4MDNcXHgwMlxceDAyXFx4MDI5PVxceDAzXFx4MDJcXHgwMlxceDAyOjhcXHgwM1xceDAyXFx4MDJcXHgwMlwiK1xuXHRcdFwiOz1cXHgwM1xceDAyXFx4MDJcXHgwMjwzXFx4MDNcXHgwMlxceDAyXFx4MDI8O1xceDAzXFx4MDJcXHgwMlxceDAyPT5cXHgwM1xceDAyXFx4MDJcXHgwMlwiK1xuXHRcdFwiPj9cXHgwN1xceDE0XFx4MDJcXHgwMj9cXHgwN1xceDAzXFx4MDJcXHgwMlxceDAyQE5cXHgwNVxcZlxceDA3XFx4MDJBQ1xceDA1XFx4MTRcXHZcXHgwMlwiK1xuXHRcdFwiQkFcXHgwM1xceDAyXFx4MDJcXHgwMkJDXFx4MDNcXHgwMlxceDAyXFx4MDJDRFxceDAzXFx4MDJcXHgwMlxceDAyREVcXHgwNVxceDE2XFxmXFx4MDJcIitcblx0XHRcIkVGXFx4MDdcXHgwM1xceDAyXFx4MDJGSFxceDA1XFx4MThcXHJcXHgwMkdJXFx4MDVcXHgwRVxcYlxceDAySEdcXHgwM1xceDAyXFx4MDJcXHgwMkhcIitcblx0XHRcIklcXHgwM1xceDAyXFx4MDJcXHgwMklLXFx4MDNcXHgwMlxceDAyXFx4MDJKTFxceDA1XFx4MTBcXHRcXHgwMktKXFx4MDNcXHgwMlxceDAyXFx4MDJcIitcblx0XHRcIktMXFx4MDNcXHgwMlxceDAyXFx4MDJMTlxceDAzXFx4MDJcXHgwMlxceDAyTUBcXHgwM1xceDAyXFx4MDJcXHgwMk1CXFx4MDNcXHgwMlxceDAyXFx4MDJcIitcblx0XHRcIk5cXHRcXHgwM1xceDAyXFx4MDJcXHgwMk9QXFx4MDVcXHgxNlxcZlxceDAyUFFcXHgwN1xceDA0XFx4MDJcXHgwMlFTXFx4MDVcXHgxOFxcclxceDAyXCIrXG5cdFx0XCJSVFxceDA1XFx4MEVcXGJcXHgwMlNSXFx4MDNcXHgwMlxceDAyXFx4MDJTVFxceDAzXFx4MDJcXHgwMlxceDAyVFZcXHgwM1xceDAyXFx4MDJcXHgwMlwiK1xuXHRcdFwiVVdcXHgwNVxceDEwXFx0XFx4MDJWVVxceDAzXFx4MDJcXHgwMlxceDAyVldcXHgwM1xceDAyXFx4MDJcXHgwMldcXHZcXHgwM1xceDAyXFx4MDJcXHgwMlwiK1xuXHRcdFwiWFlcXHgwNVxceDFBXFx4MEVcXHgwMllaXFx4MDdcXG5cXHgwMlxceDAyWltcXHgwN1xceDA3XFx4MDJcXHgwMltcXHJcXHgwM1xceDAyXFx4MDJcXHgwMlwiK1xuXHRcdFwiXFxcXF1cXHgwN1xcZlxceDAyXFx4MDJdXlxceDA3XFx2XFx4MDJcXHgwMl5iXFx4MDVcXHgxMlxcblxceDAyX2BcXHgwN1xcdlxceDAyXFx4MDJgYlxceDA1XCIrXG5cdFx0XCJcXHgxMlxcblxceDAyYVxcXFxcXHgwM1xceDAyXFx4MDJcXHgwMmFfXFx4MDNcXHgwMlxceDAyXFx4MDJiXFx4MEZcXHgwM1xceDAyXFx4MDJcXHgwMmNcIitcblx0XHRcImRcXHgwN1xceDA2XFx4MDJcXHgwMmRlXFx4MDVcXHgxMlxcblxceDAyZVxceDExXFx4MDNcXHgwMlxceDAyXFx4MDJmZ1xceDA3XFx4MTFcXHgwMlxceDAyXCIrXG5cdFx0XCJnaFxceDA1XFx4MTJcXG5cXHgwMmhpXFx4MDdcXHgxMlxceDAyXFx4MDJpdFxceDAzXFx4MDJcXHgwMlxceDAyamtcXHgwNVxceDFBXFx4MEVcXHgwMlwiK1xuXHRcdFwia2xcXHgwN1xcdFxceDAyXFx4MDJsbVxceDA1XFx4MTJcXG5cXHgwMm10XFx4MDNcXHgwMlxceDAyXFx4MDJub1xceDA1XFx4MUFcXHgwRVxceDAyb1wiK1xuXHRcdFwicFxceDA3XFxiXFx4MDJcXHgwMnBxXFx4MDVcXHgxMlxcblxceDAycXRcXHgwM1xceDAyXFx4MDJcXHgwMnJ0XFx4MDVcXHgxQVxceDBFXFx4MDJzZlwiK1xuXHRcdFwiXFx4MDNcXHgwMlxceDAyXFx4MDJzalxceDAzXFx4MDJcXHgwMlxceDAyc25cXHgwM1xceDAyXFx4MDJcXHgwMnNyXFx4MDNcXHgwMlxceDAyXFx4MDJcIitcblx0XHRcInRcXHgxM1xceDAzXFx4MDJcXHgwMlxceDAydXZcXHgwN1xcclxceDAyXFx4MDJ2d1xceDA1XFx4MUVcXHgxMFxceDAyd3hcXHgwN1xceDBFXFx4MDJcIitcblx0XHRcIlxceDAyeFxceDE1XFx4MDNcXHgwMlxceDAyXFx4MDJ5elxceDA1XFx4MUFcXHgwRVxceDAyelxceDE3XFx4MDNcXHgwMlxceDAyXFx4MDJ7fFxceDA1XCIrXG5cdFx0XCJcXHgxQVxceDBFXFx4MDJ8XFx4MTlcXHgwM1xceDAyXFx4MDJcXHgwMn1cXHg4MVxceDA1IFxceDExXFx4MDJ+XFx4ODFcXHgwNVxceDFDXFx4MEZcXHgwMlwiK1xuXHRcdFwiXFx4N0ZcXHg4MVxceDA3XFx4MDVcXHgwMlxceDAyXFx4ODB9XFx4MDNcXHgwMlxceDAyXFx4MDJcXHg4MH5cXHgwM1xceDAyXFx4MDJcXHgwMlxceDgwXCIrXG5cdFx0XCJcXHg3RlxceDAzXFx4MDJcXHgwMlxceDAyXFx4ODFcXHgxQlxceDAzXFx4MDJcXHgwMlxceDAyXFx4ODJcXHg4M1xceDA1XFx4MUVcXHgxMFxceDAyXFx4ODNcIitcblx0XHRcIlxceDg0XFx4MDdcXHgwRlxceDAyXFx4MDJcXHg4NFxceDg2XFx4MDNcXHgwMlxceDAyXFx4MDJcXHg4NVxceDgyXFx4MDNcXHgwMlxceDAyXFx4MDJcXHg4NlwiK1xuXHRcdFwiXFx4ODdcXHgwM1xceDAyXFx4MDJcXHgwMlxceDg3XFx4ODVcXHgwM1xceDAyXFx4MDJcXHgwMlxceDg3XFx4ODhcXHgwM1xceDAyXFx4MDJcXHgwMlxceDg4XCIrXG5cdFx0XCJcXHg4OVxceDAzXFx4MDJcXHgwMlxceDAyXFx4ODlcXHg4QVxceDA1IFxceDExXFx4MDJcXHg4QVxceDFEXFx4MDNcXHgwMlxceDAyXFx4MDJcXHg4QlwiK1xuXHRcdFwiXFx4OENcXHgwN1xceDE1XFx4MDJcXHgwMlxceDhDXFx4MUZcXHgwM1xceDAyXFx4MDJcXHgwMlxceDhEXFx4OEVcXHgwN1xceDE1XFx4MDJcXHgwMlxceDhFXCIrXG5cdFx0XCIhXFx4MDNcXHgwMlxceDAyXFx4MDJcXHg4RlxceDkwXFx4MDdcXHgxNVxceDAyXFx4MDJcXHg5MCNcXHgwM1xceDAyXFx4MDJcXHgwMlxceDBGLTg8XCIrXG5cdFx0XCJCSEtNU1Zhc1xceDgwXFx4ODdcIjtcblx0cHVibGljIHN0YXRpYyBfX0FUTjogQVROO1xuXHRwdWJsaWMgc3RhdGljIGdldCBfQVROKCk6IEFUTiB7XG5cdFx0aWYgKCFiaW5kaW5nX2dyYW1tYXJQYXJzZXIuX19BVE4pIHtcblx0XHRcdGJpbmRpbmdfZ3JhbW1hclBhcnNlci5fX0FUTiA9IG5ldyBBVE5EZXNlcmlhbGl6ZXIoKS5kZXNlcmlhbGl6ZShVdGlscy50b0NoYXJBcnJheShiaW5kaW5nX2dyYW1tYXJQYXJzZXIuX3NlcmlhbGl6ZWRBVE4pKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYmluZGluZ19ncmFtbWFyUGFyc2VyLl9fQVROO1xuXHR9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEJpbmRpbmdfcG9saWN5Q29udGV4dCBleHRlbmRzIFBhcnNlclJ1bGVDb250ZXh0IHtcblx0cHVibGljIGJpbmRpbmdfc2V0KCk6IEJpbmRpbmdfc2V0Q29udGV4dCB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UnVsZUNvbnRleHQoMCwgQmluZGluZ19zZXRDb250ZXh0KTtcblx0fVxuXHRwdWJsaWMgdW5iaW5kaW5nX3NldCgpOiBVbmJpbmRpbmdfc2V0Q29udGV4dCB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UnVsZUNvbnRleHQoMCwgVW5iaW5kaW5nX3NldENvbnRleHQpO1xuXHR9XG5cdGNvbnN0cnVjdG9yKHBhcmVudDogUGFyc2VyUnVsZUNvbnRleHQsIGludm9raW5nU3RhdGU6IG51bWJlcik7XG5cdGNvbnN0cnVjdG9yKHBhcmVudDogUGFyc2VyUnVsZUNvbnRleHQsIGludm9raW5nU3RhdGU6IG51bWJlcikge1xuXHRcdHN1cGVyKHBhcmVudCwgaW52b2tpbmdTdGF0ZSk7XG5cblx0fVxuXHRAT3ZlcnJpZGUgcHVibGljIGdldCBydWxlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIGJpbmRpbmdfZ3JhbW1hclBhcnNlci5SVUxFX2JpbmRpbmdfcG9saWN5OyB9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgZW50ZXJSdWxlKGxpc3RlbmVyOiBiaW5kaW5nX2dyYW1tYXJMaXN0ZW5lcik6IHZvaWQge1xuXHRcdGlmIChsaXN0ZW5lci5lbnRlckJpbmRpbmdfcG9saWN5KSBsaXN0ZW5lci5lbnRlckJpbmRpbmdfcG9saWN5KHRoaXMpO1xuXHR9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgZXhpdFJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmV4aXRCaW5kaW5nX3BvbGljeSkgbGlzdGVuZXIuZXhpdEJpbmRpbmdfcG9saWN5KHRoaXMpO1xuXHR9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgYWNjZXB0PFJlc3VsdD4odmlzaXRvcjogYmluZGluZ19ncmFtbWFyVmlzaXRvcjxSZXN1bHQ+KTogUmVzdWx0IHtcblx0XHRpZiAodmlzaXRvci52aXNpdEJpbmRpbmdfcG9saWN5KSByZXR1cm4gdmlzaXRvci52aXNpdEJpbmRpbmdfcG9saWN5KHRoaXMpO1xuXHRcdGVsc2UgcmV0dXJuIHZpc2l0b3IudmlzaXRDaGlsZHJlbih0aGlzKTtcblx0fVxufVxuXG5cbmV4cG9ydCBjbGFzcyBCaW5kaW5nX3NldENvbnRleHQgZXh0ZW5kcyBQYXJzZXJSdWxlQ29udGV4dCB7XG5cdHB1YmxpYyBMQlJBQ0VTKCk6IFRlcm1pbmFsTm9kZSB7IHJldHVybiB0aGlzLmdldFRva2VuKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5MQlJBQ0VTLCAwKTsgfVxuXHRwdWJsaWMgYmluZGluZ19zdGF0ZW1lbnQoKTogQmluZGluZ19zdGF0ZW1lbnRDb250ZXh0W107XG5cdHB1YmxpYyBiaW5kaW5nX3N0YXRlbWVudChpOiBudW1iZXIpOiBCaW5kaW5nX3N0YXRlbWVudENvbnRleHQ7XG5cdHB1YmxpYyBiaW5kaW5nX3N0YXRlbWVudChpPzogbnVtYmVyKTogQmluZGluZ19zdGF0ZW1lbnRDb250ZXh0IHwgQmluZGluZ19zdGF0ZW1lbnRDb250ZXh0W10ge1xuXHRcdGlmIChpID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiB0aGlzLmdldFJ1bGVDb250ZXh0cyhCaW5kaW5nX3N0YXRlbWVudENvbnRleHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZXRSdWxlQ29udGV4dChpLCBCaW5kaW5nX3N0YXRlbWVudENvbnRleHQpO1xuXHRcdH1cblx0fVxuXHRwdWJsaWMgUkJSQUNFUygpOiBUZXJtaW5hbE5vZGUgeyByZXR1cm4gdGhpcy5nZXRUb2tlbihiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUkJSQUNFUywgMCk7IH1cblx0cHVibGljIFNFTUlDT0xPTigpOiBUZXJtaW5hbE5vZGVbXTtcblx0cHVibGljIFNFTUlDT0xPTihpOiBudW1iZXIpOiBUZXJtaW5hbE5vZGU7XG5cdHB1YmxpYyBTRU1JQ09MT04oaT86IG51bWJlcik6IFRlcm1pbmFsTm9kZSB8IFRlcm1pbmFsTm9kZVtdIHtcblx0XHRpZiAoaSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZXRUb2tlbnMoYmluZGluZ19ncmFtbWFyUGFyc2VyLlNFTUlDT0xPTik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLmdldFRva2VuKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5TRU1JQ09MT04sIGkpO1xuXHRcdH1cblx0fVxuXHRjb25zdHJ1Y3RvcihwYXJlbnQ6IFBhcnNlclJ1bGVDb250ZXh0LCBpbnZva2luZ1N0YXRlOiBudW1iZXIpO1xuXHRjb25zdHJ1Y3RvcihwYXJlbnQ6IFBhcnNlclJ1bGVDb250ZXh0LCBpbnZva2luZ1N0YXRlOiBudW1iZXIpIHtcblx0XHRzdXBlcihwYXJlbnQsIGludm9raW5nU3RhdGUpO1xuXG5cdH1cblx0QE92ZXJyaWRlIHB1YmxpYyBnZXQgcnVsZUluZGV4KCk6IG51bWJlciB7IHJldHVybiBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUlVMRV9iaW5kaW5nX3NldDsgfVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGVudGVyUnVsZShsaXN0ZW5lcjogYmluZGluZ19ncmFtbWFyTGlzdGVuZXIpOiB2b2lkIHtcblx0XHRpZiAobGlzdGVuZXIuZW50ZXJCaW5kaW5nX3NldCkgbGlzdGVuZXIuZW50ZXJCaW5kaW5nX3NldCh0aGlzKTtcblx0fVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGV4aXRSdWxlKGxpc3RlbmVyOiBiaW5kaW5nX2dyYW1tYXJMaXN0ZW5lcik6IHZvaWQge1xuXHRcdGlmIChsaXN0ZW5lci5leGl0QmluZGluZ19zZXQpIGxpc3RlbmVyLmV4aXRCaW5kaW5nX3NldCh0aGlzKTtcblx0fVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGFjY2VwdDxSZXN1bHQ+KHZpc2l0b3I6IGJpbmRpbmdfZ3JhbW1hclZpc2l0b3I8UmVzdWx0Pik6IFJlc3VsdCB7XG5cdFx0aWYgKHZpc2l0b3IudmlzaXRCaW5kaW5nX3NldCkgcmV0dXJuIHZpc2l0b3IudmlzaXRCaW5kaW5nX3NldCh0aGlzKTtcblx0XHRlbHNlIHJldHVybiB2aXNpdG9yLnZpc2l0Q2hpbGRyZW4odGhpcyk7XG5cdH1cbn1cblxuXG5leHBvcnQgY2xhc3MgVW5iaW5kaW5nX3NldENvbnRleHQgZXh0ZW5kcyBQYXJzZXJSdWxlQ29udGV4dCB7XG5cdHB1YmxpYyBMQlJBQ0VTKCk6IFRlcm1pbmFsTm9kZSB7IHJldHVybiB0aGlzLmdldFRva2VuKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5MQlJBQ0VTLCAwKTsgfVxuXHRwdWJsaWMgUkJSQUNFUygpOiBUZXJtaW5hbE5vZGUgeyByZXR1cm4gdGhpcy5nZXRUb2tlbihiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUkJSQUNFUywgMCk7IH1cblx0cHVibGljIHVuYmluZGluZ19zdGF0ZW1lbnQoKTogVW5iaW5kaW5nX3N0YXRlbWVudENvbnRleHRbXTtcblx0cHVibGljIHVuYmluZGluZ19zdGF0ZW1lbnQoaTogbnVtYmVyKTogVW5iaW5kaW5nX3N0YXRlbWVudENvbnRleHQ7XG5cdHB1YmxpYyB1bmJpbmRpbmdfc3RhdGVtZW50KGk/OiBudW1iZXIpOiBVbmJpbmRpbmdfc3RhdGVtZW50Q29udGV4dCB8IFVuYmluZGluZ19zdGF0ZW1lbnRDb250ZXh0W10ge1xuXHRcdGlmIChpID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiB0aGlzLmdldFJ1bGVDb250ZXh0cyhVbmJpbmRpbmdfc3RhdGVtZW50Q29udGV4dCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLmdldFJ1bGVDb250ZXh0KGksIFVuYmluZGluZ19zdGF0ZW1lbnRDb250ZXh0KTtcblx0XHR9XG5cdH1cblx0cHVibGljIFNFTUlDT0xPTigpOiBUZXJtaW5hbE5vZGVbXTtcblx0cHVibGljIFNFTUlDT0xPTihpOiBudW1iZXIpOiBUZXJtaW5hbE5vZGU7XG5cdHB1YmxpYyBTRU1JQ09MT04oaT86IG51bWJlcik6IFRlcm1pbmFsTm9kZSB8IFRlcm1pbmFsTm9kZVtdIHtcblx0XHRpZiAoaSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZXRUb2tlbnMoYmluZGluZ19ncmFtbWFyUGFyc2VyLlNFTUlDT0xPTik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLmdldFRva2VuKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5TRU1JQ09MT04sIGkpO1xuXHRcdH1cblx0fVxuXHRjb25zdHJ1Y3RvcihwYXJlbnQ6IFBhcnNlclJ1bGVDb250ZXh0LCBpbnZva2luZ1N0YXRlOiBudW1iZXIpO1xuXHRjb25zdHJ1Y3RvcihwYXJlbnQ6IFBhcnNlclJ1bGVDb250ZXh0LCBpbnZva2luZ1N0YXRlOiBudW1iZXIpIHtcblx0XHRzdXBlcihwYXJlbnQsIGludm9raW5nU3RhdGUpO1xuXG5cdH1cblx0QE92ZXJyaWRlIHB1YmxpYyBnZXQgcnVsZUluZGV4KCk6IG51bWJlciB7IHJldHVybiBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUlVMRV91bmJpbmRpbmdfc2V0OyB9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgZW50ZXJSdWxlKGxpc3RlbmVyOiBiaW5kaW5nX2dyYW1tYXJMaXN0ZW5lcik6IHZvaWQge1xuXHRcdGlmIChsaXN0ZW5lci5lbnRlclVuYmluZGluZ19zZXQpIGxpc3RlbmVyLmVudGVyVW5iaW5kaW5nX3NldCh0aGlzKTtcblx0fVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGV4aXRSdWxlKGxpc3RlbmVyOiBiaW5kaW5nX2dyYW1tYXJMaXN0ZW5lcik6IHZvaWQge1xuXHRcdGlmIChsaXN0ZW5lci5leGl0VW5iaW5kaW5nX3NldCkgbGlzdGVuZXIuZXhpdFVuYmluZGluZ19zZXQodGhpcyk7XG5cdH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBhY2NlcHQ8UmVzdWx0Pih2aXNpdG9yOiBiaW5kaW5nX2dyYW1tYXJWaXNpdG9yPFJlc3VsdD4pOiBSZXN1bHQge1xuXHRcdGlmICh2aXNpdG9yLnZpc2l0VW5iaW5kaW5nX3NldCkgcmV0dXJuIHZpc2l0b3IudmlzaXRVbmJpbmRpbmdfc2V0KHRoaXMpO1xuXHRcdGVsc2UgcmV0dXJuIHZpc2l0b3IudmlzaXRDaGlsZHJlbih0aGlzKTtcblx0fVxufVxuXG5cbmV4cG9ydCBjbGFzcyBCaW5kaW5nX3N0YXRlbWVudENvbnRleHQgZXh0ZW5kcyBQYXJzZXJSdWxlQ29udGV4dCB7XG5cdHB1YmxpYyBpc19jcmVhdG9yKCk6IElzX2NyZWF0b3JDb250ZXh0IHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gdGhpcy50cnlHZXRSdWxlQ29udGV4dCgwLCBJc19jcmVhdG9yQ29udGV4dCk7XG5cdH1cblx0cHVibGljIG5vbWluYXRvcigpOiBOb21pbmF0b3JDb250ZXh0IHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gdGhpcy50cnlHZXRSdWxlQ29udGV4dCgwLCBOb21pbmF0b3JDb250ZXh0KTtcblx0fVxuXHRwdWJsaWMgTk9NSU5BVEVTKCk6IFRlcm1pbmFsTm9kZSB8IHVuZGVmaW5lZCB7IHJldHVybiB0aGlzLnRyeUdldFRva2VuKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5OT01JTkFURVMsIDApOyB9XG5cdHB1YmxpYyBub21pbmVlKCk6IE5vbWluZWVDb250ZXh0IHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gdGhpcy50cnlHZXRSdWxlQ29udGV4dCgwLCBOb21pbmVlQ29udGV4dCk7XG5cdH1cblx0cHVibGljIHNjb3BlX3Jlc3RyaWN0aW9uKCk6IFNjb3BlX3Jlc3RyaWN0aW9uQ29udGV4dCB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRoaXMudHJ5R2V0UnVsZUNvbnRleHQoMCwgU2NvcGVfcmVzdHJpY3Rpb25Db250ZXh0KTtcblx0fVxuXHRwdWJsaWMgYmluZGluZ19jb25zdHIoKTogQmluZGluZ19jb25zdHJDb250ZXh0IHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gdGhpcy50cnlHZXRSdWxlQ29udGV4dCgwLCBCaW5kaW5nX2NvbnN0ckNvbnRleHQpO1xuXHR9XG5cdHB1YmxpYyBlbmRvcnNlbWVudF9jb25zdHIoKTogRW5kb3JzZW1lbnRfY29uc3RyQ29udGV4dCB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRoaXMudHJ5R2V0UnVsZUNvbnRleHQoMCwgRW5kb3JzZW1lbnRfY29uc3RyQ29udGV4dCk7XG5cdH1cblx0Y29uc3RydWN0b3IocGFyZW50OiBQYXJzZXJSdWxlQ29udGV4dCwgaW52b2tpbmdTdGF0ZTogbnVtYmVyKTtcblx0Y29uc3RydWN0b3IocGFyZW50OiBQYXJzZXJSdWxlQ29udGV4dCwgaW52b2tpbmdTdGF0ZTogbnVtYmVyKSB7XG5cdFx0c3VwZXIocGFyZW50LCBpbnZva2luZ1N0YXRlKTtcblxuXHR9XG5cdEBPdmVycmlkZSBwdWJsaWMgZ2V0IHJ1bGVJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfYmluZGluZ19zdGF0ZW1lbnQ7IH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBlbnRlclJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmVudGVyQmluZGluZ19zdGF0ZW1lbnQpIGxpc3RlbmVyLmVudGVyQmluZGluZ19zdGF0ZW1lbnQodGhpcyk7XG5cdH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBleGl0UnVsZShsaXN0ZW5lcjogYmluZGluZ19ncmFtbWFyTGlzdGVuZXIpOiB2b2lkIHtcblx0XHRpZiAobGlzdGVuZXIuZXhpdEJpbmRpbmdfc3RhdGVtZW50KSBsaXN0ZW5lci5leGl0QmluZGluZ19zdGF0ZW1lbnQodGhpcyk7XG5cdH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBhY2NlcHQ8UmVzdWx0Pih2aXNpdG9yOiBiaW5kaW5nX2dyYW1tYXJWaXNpdG9yPFJlc3VsdD4pOiBSZXN1bHQge1xuXHRcdGlmICh2aXNpdG9yLnZpc2l0QmluZGluZ19zdGF0ZW1lbnQpIHJldHVybiB2aXNpdG9yLnZpc2l0QmluZGluZ19zdGF0ZW1lbnQodGhpcyk7XG5cdFx0ZWxzZSByZXR1cm4gdmlzaXRvci52aXNpdENoaWxkcmVuKHRoaXMpO1xuXHR9XG59XG5cblxuZXhwb3J0IGNsYXNzIFVuYmluZGluZ19zdGF0ZW1lbnRDb250ZXh0IGV4dGVuZHMgUGFyc2VyUnVsZUNvbnRleHQge1xuXHRwdWJsaWMgbm9taW5hdG9yKCk6IE5vbWluYXRvckNvbnRleHQge1xuXHRcdHJldHVybiB0aGlzLmdldFJ1bGVDb250ZXh0KDAsIE5vbWluYXRvckNvbnRleHQpO1xuXHR9XG5cdHB1YmxpYyBSRUxFQVNFUygpOiBUZXJtaW5hbE5vZGUgeyByZXR1cm4gdGhpcy5nZXRUb2tlbihiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUkVMRUFTRVMsIDApOyB9XG5cdHB1YmxpYyBub21pbmVlKCk6IE5vbWluZWVDb250ZXh0IHtcblx0XHRyZXR1cm4gdGhpcy5nZXRSdWxlQ29udGV4dCgwLCBOb21pbmVlQ29udGV4dCk7XG5cdH1cblx0cHVibGljIGJpbmRpbmdfY29uc3RyKCk6IEJpbmRpbmdfY29uc3RyQ29udGV4dCB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRoaXMudHJ5R2V0UnVsZUNvbnRleHQoMCwgQmluZGluZ19jb25zdHJDb250ZXh0KTtcblx0fVxuXHRwdWJsaWMgZW5kb3JzZW1lbnRfY29uc3RyKCk6IEVuZG9yc2VtZW50X2NvbnN0ckNvbnRleHQgfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiB0aGlzLnRyeUdldFJ1bGVDb250ZXh0KDAsIEVuZG9yc2VtZW50X2NvbnN0ckNvbnRleHQpO1xuXHR9XG5cdGNvbnN0cnVjdG9yKHBhcmVudDogUGFyc2VyUnVsZUNvbnRleHQsIGludm9raW5nU3RhdGU6IG51bWJlcik7XG5cdGNvbnN0cnVjdG9yKHBhcmVudDogUGFyc2VyUnVsZUNvbnRleHQsIGludm9raW5nU3RhdGU6IG51bWJlcikge1xuXHRcdHN1cGVyKHBhcmVudCwgaW52b2tpbmdTdGF0ZSk7XG5cblx0fVxuXHRAT3ZlcnJpZGUgcHVibGljIGdldCBydWxlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIGJpbmRpbmdfZ3JhbW1hclBhcnNlci5SVUxFX3VuYmluZGluZ19zdGF0ZW1lbnQ7IH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBlbnRlclJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmVudGVyVW5iaW5kaW5nX3N0YXRlbWVudCkgbGlzdGVuZXIuZW50ZXJVbmJpbmRpbmdfc3RhdGVtZW50KHRoaXMpO1xuXHR9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgZXhpdFJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmV4aXRVbmJpbmRpbmdfc3RhdGVtZW50KSBsaXN0ZW5lci5leGl0VW5iaW5kaW5nX3N0YXRlbWVudCh0aGlzKTtcblx0fVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGFjY2VwdDxSZXN1bHQ+KHZpc2l0b3I6IGJpbmRpbmdfZ3JhbW1hclZpc2l0b3I8UmVzdWx0Pik6IFJlc3VsdCB7XG5cdFx0aWYgKHZpc2l0b3IudmlzaXRVbmJpbmRpbmdfc3RhdGVtZW50KSByZXR1cm4gdmlzaXRvci52aXNpdFVuYmluZGluZ19zdGF0ZW1lbnQodGhpcyk7XG5cdFx0ZWxzZSByZXR1cm4gdmlzaXRvci52aXNpdENoaWxkcmVuKHRoaXMpO1xuXHR9XG59XG5cblxuZXhwb3J0IGNsYXNzIElzX2NyZWF0b3JDb250ZXh0IGV4dGVuZHMgUGFyc2VyUnVsZUNvbnRleHQge1xuXHRwdWJsaWMgcm9sZSgpOiBSb2xlQ29udGV4dCB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UnVsZUNvbnRleHQoMCwgUm9sZUNvbnRleHQpO1xuXHR9XG5cdHB1YmxpYyBJUygpOiBUZXJtaW5hbE5vZGUgeyByZXR1cm4gdGhpcy5nZXRUb2tlbihiaW5kaW5nX2dyYW1tYXJQYXJzZXIuSVMsIDApOyB9XG5cdHB1YmxpYyBDQVNFX0NSRUFUT1IoKTogVGVybWluYWxOb2RlIHsgcmV0dXJuIHRoaXMuZ2V0VG9rZW4oYmluZGluZ19ncmFtbWFyUGFyc2VyLkNBU0VfQ1JFQVRPUiwgMCk7IH1cblx0Y29uc3RydWN0b3IocGFyZW50OiBQYXJzZXJSdWxlQ29udGV4dCwgaW52b2tpbmdTdGF0ZTogbnVtYmVyKTtcblx0Y29uc3RydWN0b3IocGFyZW50OiBQYXJzZXJSdWxlQ29udGV4dCwgaW52b2tpbmdTdGF0ZTogbnVtYmVyKSB7XG5cdFx0c3VwZXIocGFyZW50LCBpbnZva2luZ1N0YXRlKTtcblxuXHR9XG5cdEBPdmVycmlkZSBwdWJsaWMgZ2V0IHJ1bGVJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfaXNfY3JlYXRvcjsgfVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGVudGVyUnVsZShsaXN0ZW5lcjogYmluZGluZ19ncmFtbWFyTGlzdGVuZXIpOiB2b2lkIHtcblx0XHRpZiAobGlzdGVuZXIuZW50ZXJJc19jcmVhdG9yKSBsaXN0ZW5lci5lbnRlcklzX2NyZWF0b3IodGhpcyk7XG5cdH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBleGl0UnVsZShsaXN0ZW5lcjogYmluZGluZ19ncmFtbWFyTGlzdGVuZXIpOiB2b2lkIHtcblx0XHRpZiAobGlzdGVuZXIuZXhpdElzX2NyZWF0b3IpIGxpc3RlbmVyLmV4aXRJc19jcmVhdG9yKHRoaXMpO1xuXHR9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgYWNjZXB0PFJlc3VsdD4odmlzaXRvcjogYmluZGluZ19ncmFtbWFyVmlzaXRvcjxSZXN1bHQ+KTogUmVzdWx0IHtcblx0XHRpZiAodmlzaXRvci52aXNpdElzX2NyZWF0b3IpIHJldHVybiB2aXNpdG9yLnZpc2l0SXNfY3JlYXRvcih0aGlzKTtcblx0XHRlbHNlIHJldHVybiB2aXNpdG9yLnZpc2l0Q2hpbGRyZW4odGhpcyk7XG5cdH1cbn1cblxuXG5leHBvcnQgY2xhc3MgQmluZGluZ19jb25zdHJDb250ZXh0IGV4dGVuZHMgUGFyc2VyUnVsZUNvbnRleHQge1xuXHRwdWJsaWMgTk9UKCk6IFRlcm1pbmFsTm9kZSB8IHVuZGVmaW5lZCB7IHJldHVybiB0aGlzLnRyeUdldFRva2VuKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5OT1QsIDApOyB9XG5cdHB1YmxpYyBJTigpOiBUZXJtaW5hbE5vZGUgeyByZXR1cm4gdGhpcy5nZXRUb2tlbihiaW5kaW5nX2dyYW1tYXJQYXJzZXIuSU4sIDApOyB9XG5cdHB1YmxpYyBzZXRfZXhwcmVzaW9uKCk6IFNldF9leHByZXNpb25Db250ZXh0IHtcblx0XHRyZXR1cm4gdGhpcy5nZXRSdWxlQ29udGV4dCgwLCBTZXRfZXhwcmVzaW9uQ29udGV4dCk7XG5cdH1cblx0Y29uc3RydWN0b3IocGFyZW50OiBQYXJzZXJSdWxlQ29udGV4dCwgaW52b2tpbmdTdGF0ZTogbnVtYmVyKTtcblx0Y29uc3RydWN0b3IocGFyZW50OiBQYXJzZXJSdWxlQ29udGV4dCwgaW52b2tpbmdTdGF0ZTogbnVtYmVyKSB7XG5cdFx0c3VwZXIocGFyZW50LCBpbnZva2luZ1N0YXRlKTtcblxuXHR9XG5cdEBPdmVycmlkZSBwdWJsaWMgZ2V0IHJ1bGVJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfYmluZGluZ19jb25zdHI7IH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBlbnRlclJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmVudGVyQmluZGluZ19jb25zdHIpIGxpc3RlbmVyLmVudGVyQmluZGluZ19jb25zdHIodGhpcyk7XG5cdH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBleGl0UnVsZShsaXN0ZW5lcjogYmluZGluZ19ncmFtbWFyTGlzdGVuZXIpOiB2b2lkIHtcblx0XHRpZiAobGlzdGVuZXIuZXhpdEJpbmRpbmdfY29uc3RyKSBsaXN0ZW5lci5leGl0QmluZGluZ19jb25zdHIodGhpcyk7XG5cdH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBhY2NlcHQ8UmVzdWx0Pih2aXNpdG9yOiBiaW5kaW5nX2dyYW1tYXJWaXNpdG9yPFJlc3VsdD4pOiBSZXN1bHQge1xuXHRcdGlmICh2aXNpdG9yLnZpc2l0QmluZGluZ19jb25zdHIpIHJldHVybiB2aXNpdG9yLnZpc2l0QmluZGluZ19jb25zdHIodGhpcyk7XG5cdFx0ZWxzZSByZXR1cm4gdmlzaXRvci52aXNpdENoaWxkcmVuKHRoaXMpO1xuXHR9XG59XG5cblxuZXhwb3J0IGNsYXNzIEVuZG9yc2VtZW50X2NvbnN0ckNvbnRleHQgZXh0ZW5kcyBQYXJzZXJSdWxlQ29udGV4dCB7XG5cdHB1YmxpYyBFTkRPUlNFRF9CWSgpOiBUZXJtaW5hbE5vZGUgeyByZXR1cm4gdGhpcy5nZXRUb2tlbihiaW5kaW5nX2dyYW1tYXJQYXJzZXIuRU5ET1JTRURfQlksIDApOyB9XG5cdHB1YmxpYyBzZXRfZXhwcmVzaW9uKCk6IFNldF9leHByZXNpb25Db250ZXh0IHtcblx0XHRyZXR1cm4gdGhpcy5nZXRSdWxlQ29udGV4dCgwLCBTZXRfZXhwcmVzaW9uQ29udGV4dCk7XG5cdH1cblx0Y29uc3RydWN0b3IocGFyZW50OiBQYXJzZXJSdWxlQ29udGV4dCwgaW52b2tpbmdTdGF0ZTogbnVtYmVyKTtcblx0Y29uc3RydWN0b3IocGFyZW50OiBQYXJzZXJSdWxlQ29udGV4dCwgaW52b2tpbmdTdGF0ZTogbnVtYmVyKSB7XG5cdFx0c3VwZXIocGFyZW50LCBpbnZva2luZ1N0YXRlKTtcblxuXHR9XG5cdEBPdmVycmlkZSBwdWJsaWMgZ2V0IHJ1bGVJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfZW5kb3JzZW1lbnRfY29uc3RyOyB9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgZW50ZXJSdWxlKGxpc3RlbmVyOiBiaW5kaW5nX2dyYW1tYXJMaXN0ZW5lcik6IHZvaWQge1xuXHRcdGlmIChsaXN0ZW5lci5lbnRlckVuZG9yc2VtZW50X2NvbnN0cikgbGlzdGVuZXIuZW50ZXJFbmRvcnNlbWVudF9jb25zdHIodGhpcyk7XG5cdH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBleGl0UnVsZShsaXN0ZW5lcjogYmluZGluZ19ncmFtbWFyTGlzdGVuZXIpOiB2b2lkIHtcblx0XHRpZiAobGlzdGVuZXIuZXhpdEVuZG9yc2VtZW50X2NvbnN0cikgbGlzdGVuZXIuZXhpdEVuZG9yc2VtZW50X2NvbnN0cih0aGlzKTtcblx0fVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGFjY2VwdDxSZXN1bHQ+KHZpc2l0b3I6IGJpbmRpbmdfZ3JhbW1hclZpc2l0b3I8UmVzdWx0Pik6IFJlc3VsdCB7XG5cdFx0aWYgKHZpc2l0b3IudmlzaXRFbmRvcnNlbWVudF9jb25zdHIpIHJldHVybiB2aXNpdG9yLnZpc2l0RW5kb3JzZW1lbnRfY29uc3RyKHRoaXMpO1xuXHRcdGVsc2UgcmV0dXJuIHZpc2l0b3IudmlzaXRDaGlsZHJlbih0aGlzKTtcblx0fVxufVxuXG5cbmV4cG9ydCBjbGFzcyBTZXRfZXhwcmVzaW9uQ29udGV4dCBleHRlbmRzIFBhcnNlclJ1bGVDb250ZXh0IHtcblx0cHVibGljIExQQVJFTigpOiBUZXJtaW5hbE5vZGUgfCB1bmRlZmluZWQgeyByZXR1cm4gdGhpcy50cnlHZXRUb2tlbihiaW5kaW5nX2dyYW1tYXJQYXJzZXIuTFBBUkVOLCAwKTsgfVxuXHRwdWJsaWMgc2V0X2V4cHJlc2lvbigpOiBTZXRfZXhwcmVzaW9uQ29udGV4dCB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRoaXMudHJ5R2V0UnVsZUNvbnRleHQoMCwgU2V0X2V4cHJlc2lvbkNvbnRleHQpO1xuXHR9XG5cdHB1YmxpYyBSUEFSRU4oKTogVGVybWluYWxOb2RlIHwgdW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMudHJ5R2V0VG9rZW4oYmluZGluZ19ncmFtbWFyUGFyc2VyLlJQQVJFTiwgMCk7IH1cblx0cHVibGljIHJvbGUoKTogUm9sZUNvbnRleHQgfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiB0aGlzLnRyeUdldFJ1bGVDb250ZXh0KDAsIFJvbGVDb250ZXh0KTtcblx0fVxuXHRwdWJsaWMgT1IoKTogVGVybWluYWxOb2RlIHwgdW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMudHJ5R2V0VG9rZW4oYmluZGluZ19ncmFtbWFyUGFyc2VyLk9SLCAwKTsgfVxuXHRwdWJsaWMgQU5EKCk6IFRlcm1pbmFsTm9kZSB8IHVuZGVmaW5lZCB7IHJldHVybiB0aGlzLnRyeUdldFRva2VuKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5BTkQsIDApOyB9XG5cdGNvbnN0cnVjdG9yKHBhcmVudDogUGFyc2VyUnVsZUNvbnRleHQsIGludm9raW5nU3RhdGU6IG51bWJlcik7XG5cdGNvbnN0cnVjdG9yKHBhcmVudDogUGFyc2VyUnVsZUNvbnRleHQsIGludm9raW5nU3RhdGU6IG51bWJlcikge1xuXHRcdHN1cGVyKHBhcmVudCwgaW52b2tpbmdTdGF0ZSk7XG5cblx0fVxuXHRAT3ZlcnJpZGUgcHVibGljIGdldCBydWxlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIGJpbmRpbmdfZ3JhbW1hclBhcnNlci5SVUxFX3NldF9leHByZXNpb247IH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBlbnRlclJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmVudGVyU2V0X2V4cHJlc2lvbikgbGlzdGVuZXIuZW50ZXJTZXRfZXhwcmVzaW9uKHRoaXMpO1xuXHR9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgZXhpdFJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmV4aXRTZXRfZXhwcmVzaW9uKSBsaXN0ZW5lci5leGl0U2V0X2V4cHJlc2lvbih0aGlzKTtcblx0fVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGFjY2VwdDxSZXN1bHQ+KHZpc2l0b3I6IGJpbmRpbmdfZ3JhbW1hclZpc2l0b3I8UmVzdWx0Pik6IFJlc3VsdCB7XG5cdFx0aWYgKHZpc2l0b3IudmlzaXRTZXRfZXhwcmVzaW9uKSByZXR1cm4gdmlzaXRvci52aXNpdFNldF9leHByZXNpb24odGhpcyk7XG5cdFx0ZWxzZSByZXR1cm4gdmlzaXRvci52aXNpdENoaWxkcmVuKHRoaXMpO1xuXHR9XG59XG5cblxuZXhwb3J0IGNsYXNzIFNjb3BlX3Jlc3RyaWN0aW9uQ29udGV4dCBleHRlbmRzIFBhcnNlclJ1bGVDb250ZXh0IHtcblx0cHVibGljIFVOREVSKCk6IFRlcm1pbmFsTm9kZSB7IHJldHVybiB0aGlzLmdldFRva2VuKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5VTkRFUiwgMCk7IH1cblx0cHVibGljIHN1YnByb2Nlc3NfaWQoKTogU3VicHJvY2Vzc19pZENvbnRleHQge1xuXHRcdHJldHVybiB0aGlzLmdldFJ1bGVDb250ZXh0KDAsIFN1YnByb2Nlc3NfaWRDb250ZXh0KTtcblx0fVxuXHRwdWJsaWMgQ09NTUEoKTogVGVybWluYWxOb2RlIHsgcmV0dXJuIHRoaXMuZ2V0VG9rZW4oYmluZGluZ19ncmFtbWFyUGFyc2VyLkNPTU1BLCAwKTsgfVxuXHRjb25zdHJ1Y3RvcihwYXJlbnQ6IFBhcnNlclJ1bGVDb250ZXh0LCBpbnZva2luZ1N0YXRlOiBudW1iZXIpO1xuXHRjb25zdHJ1Y3RvcihwYXJlbnQ6IFBhcnNlclJ1bGVDb250ZXh0LCBpbnZva2luZ1N0YXRlOiBudW1iZXIpIHtcblx0XHRzdXBlcihwYXJlbnQsIGludm9raW5nU3RhdGUpO1xuXG5cdH1cblx0QE92ZXJyaWRlIHB1YmxpYyBnZXQgcnVsZUluZGV4KCk6IG51bWJlciB7IHJldHVybiBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUlVMRV9zY29wZV9yZXN0cmljdGlvbjsgfVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGVudGVyUnVsZShsaXN0ZW5lcjogYmluZGluZ19ncmFtbWFyTGlzdGVuZXIpOiB2b2lkIHtcblx0XHRpZiAobGlzdGVuZXIuZW50ZXJTY29wZV9yZXN0cmljdGlvbikgbGlzdGVuZXIuZW50ZXJTY29wZV9yZXN0cmljdGlvbih0aGlzKTtcblx0fVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGV4aXRSdWxlKGxpc3RlbmVyOiBiaW5kaW5nX2dyYW1tYXJMaXN0ZW5lcik6IHZvaWQge1xuXHRcdGlmIChsaXN0ZW5lci5leGl0U2NvcGVfcmVzdHJpY3Rpb24pIGxpc3RlbmVyLmV4aXRTY29wZV9yZXN0cmljdGlvbih0aGlzKTtcblx0fVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGFjY2VwdDxSZXN1bHQ+KHZpc2l0b3I6IGJpbmRpbmdfZ3JhbW1hclZpc2l0b3I8UmVzdWx0Pik6IFJlc3VsdCB7XG5cdFx0aWYgKHZpc2l0b3IudmlzaXRTY29wZV9yZXN0cmljdGlvbikgcmV0dXJuIHZpc2l0b3IudmlzaXRTY29wZV9yZXN0cmljdGlvbih0aGlzKTtcblx0XHRlbHNlIHJldHVybiB2aXNpdG9yLnZpc2l0Q2hpbGRyZW4odGhpcyk7XG5cdH1cbn1cblxuXG5leHBvcnQgY2xhc3MgTm9taW5hdG9yQ29udGV4dCBleHRlbmRzIFBhcnNlclJ1bGVDb250ZXh0IHtcblx0cHVibGljIHJvbGUoKTogUm9sZUNvbnRleHQge1xuXHRcdHJldHVybiB0aGlzLmdldFJ1bGVDb250ZXh0KDAsIFJvbGVDb250ZXh0KTtcblx0fVxuXHRjb25zdHJ1Y3RvcihwYXJlbnQ6IFBhcnNlclJ1bGVDb250ZXh0LCBpbnZva2luZ1N0YXRlOiBudW1iZXIpO1xuXHRjb25zdHJ1Y3RvcihwYXJlbnQ6IFBhcnNlclJ1bGVDb250ZXh0LCBpbnZva2luZ1N0YXRlOiBudW1iZXIpIHtcblx0XHRzdXBlcihwYXJlbnQsIGludm9raW5nU3RhdGUpO1xuXG5cdH1cblx0QE92ZXJyaWRlIHB1YmxpYyBnZXQgcnVsZUluZGV4KCk6IG51bWJlciB7IHJldHVybiBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUlVMRV9ub21pbmF0b3I7IH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBlbnRlclJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmVudGVyTm9taW5hdG9yKSBsaXN0ZW5lci5lbnRlck5vbWluYXRvcih0aGlzKTtcblx0fVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGV4aXRSdWxlKGxpc3RlbmVyOiBiaW5kaW5nX2dyYW1tYXJMaXN0ZW5lcik6IHZvaWQge1xuXHRcdGlmIChsaXN0ZW5lci5leGl0Tm9taW5hdG9yKSBsaXN0ZW5lci5leGl0Tm9taW5hdG9yKHRoaXMpO1xuXHR9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgYWNjZXB0PFJlc3VsdD4odmlzaXRvcjogYmluZGluZ19ncmFtbWFyVmlzaXRvcjxSZXN1bHQ+KTogUmVzdWx0IHtcblx0XHRpZiAodmlzaXRvci52aXNpdE5vbWluYXRvcikgcmV0dXJuIHZpc2l0b3IudmlzaXROb21pbmF0b3IodGhpcyk7XG5cdFx0ZWxzZSByZXR1cm4gdmlzaXRvci52aXNpdENoaWxkcmVuKHRoaXMpO1xuXHR9XG59XG5cblxuZXhwb3J0IGNsYXNzIE5vbWluZWVDb250ZXh0IGV4dGVuZHMgUGFyc2VyUnVsZUNvbnRleHQge1xuXHRwdWJsaWMgcm9sZSgpOiBSb2xlQ29udGV4dCB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UnVsZUNvbnRleHQoMCwgUm9sZUNvbnRleHQpO1xuXHR9XG5cdGNvbnN0cnVjdG9yKHBhcmVudDogUGFyc2VyUnVsZUNvbnRleHQsIGludm9raW5nU3RhdGU6IG51bWJlcik7XG5cdGNvbnN0cnVjdG9yKHBhcmVudDogUGFyc2VyUnVsZUNvbnRleHQsIGludm9raW5nU3RhdGU6IG51bWJlcikge1xuXHRcdHN1cGVyKHBhcmVudCwgaW52b2tpbmdTdGF0ZSk7XG5cblx0fVxuXHRAT3ZlcnJpZGUgcHVibGljIGdldCBydWxlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIGJpbmRpbmdfZ3JhbW1hclBhcnNlci5SVUxFX25vbWluZWU7IH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBlbnRlclJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmVudGVyTm9taW5lZSkgbGlzdGVuZXIuZW50ZXJOb21pbmVlKHRoaXMpO1xuXHR9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgZXhpdFJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmV4aXROb21pbmVlKSBsaXN0ZW5lci5leGl0Tm9taW5lZSh0aGlzKTtcblx0fVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGFjY2VwdDxSZXN1bHQ+KHZpc2l0b3I6IGJpbmRpbmdfZ3JhbW1hclZpc2l0b3I8UmVzdWx0Pik6IFJlc3VsdCB7XG5cdFx0aWYgKHZpc2l0b3IudmlzaXROb21pbmVlKSByZXR1cm4gdmlzaXRvci52aXNpdE5vbWluZWUodGhpcyk7XG5cdFx0ZWxzZSByZXR1cm4gdmlzaXRvci52aXNpdENoaWxkcmVuKHRoaXMpO1xuXHR9XG59XG5cblxuZXhwb3J0IGNsYXNzIFJvbGVDb250ZXh0IGV4dGVuZHMgUGFyc2VyUnVsZUNvbnRleHQge1xuXHRwdWJsaWMgcm9sZV9pZCgpOiBSb2xlX2lkQ29udGV4dCB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRoaXMudHJ5R2V0UnVsZUNvbnRleHQoMCwgUm9sZV9pZENvbnRleHQpO1xuXHR9XG5cdHB1YmxpYyByb2xlX3BhdGhfZXhwcmVzaW9uKCk6IFJvbGVfcGF0aF9leHByZXNpb25Db250ZXh0IHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gdGhpcy50cnlHZXRSdWxlQ29udGV4dCgwLCBSb2xlX3BhdGhfZXhwcmVzaW9uQ29udGV4dCk7XG5cdH1cblx0cHVibGljIFNFTEYoKTogVGVybWluYWxOb2RlIHwgdW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMudHJ5R2V0VG9rZW4oYmluZGluZ19ncmFtbWFyUGFyc2VyLlNFTEYsIDApOyB9XG5cdGNvbnN0cnVjdG9yKHBhcmVudDogUGFyc2VyUnVsZUNvbnRleHQsIGludm9raW5nU3RhdGU6IG51bWJlcik7XG5cdGNvbnN0cnVjdG9yKHBhcmVudDogUGFyc2VyUnVsZUNvbnRleHQsIGludm9raW5nU3RhdGU6IG51bWJlcikge1xuXHRcdHN1cGVyKHBhcmVudCwgaW52b2tpbmdTdGF0ZSk7XG5cblx0fVxuXHRAT3ZlcnJpZGUgcHVibGljIGdldCBydWxlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIGJpbmRpbmdfZ3JhbW1hclBhcnNlci5SVUxFX3JvbGU7IH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBlbnRlclJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmVudGVyUm9sZSkgbGlzdGVuZXIuZW50ZXJSb2xlKHRoaXMpO1xuXHR9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgZXhpdFJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmV4aXRSb2xlKSBsaXN0ZW5lci5leGl0Um9sZSh0aGlzKTtcblx0fVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGFjY2VwdDxSZXN1bHQ+KHZpc2l0b3I6IGJpbmRpbmdfZ3JhbW1hclZpc2l0b3I8UmVzdWx0Pik6IFJlc3VsdCB7XG5cdFx0aWYgKHZpc2l0b3IudmlzaXRSb2xlKSByZXR1cm4gdmlzaXRvci52aXNpdFJvbGUodGhpcyk7XG5cdFx0ZWxzZSByZXR1cm4gdmlzaXRvci52aXNpdENoaWxkcmVuKHRoaXMpO1xuXHR9XG59XG5cblxuZXhwb3J0IGNsYXNzIFJvbGVfcGF0aF9leHByZXNpb25Db250ZXh0IGV4dGVuZHMgUGFyc2VyUnVsZUNvbnRleHQge1xuXHRwdWJsaWMgcm9sZV9pZCgpOiBSb2xlX2lkQ29udGV4dCB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0UnVsZUNvbnRleHQoMCwgUm9sZV9pZENvbnRleHQpO1xuXHR9XG5cdHB1YmxpYyBzdWJwcm9jZXNzX2lkKCk6IFN1YnByb2Nlc3NfaWRDb250ZXh0W107XG5cdHB1YmxpYyBzdWJwcm9jZXNzX2lkKGk6IG51bWJlcik6IFN1YnByb2Nlc3NfaWRDb250ZXh0O1xuXHRwdWJsaWMgc3VicHJvY2Vzc19pZChpPzogbnVtYmVyKTogU3VicHJvY2Vzc19pZENvbnRleHQgfCBTdWJwcm9jZXNzX2lkQ29udGV4dFtdIHtcblx0XHRpZiAoaSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZXRSdWxlQ29udGV4dHMoU3VicHJvY2Vzc19pZENvbnRleHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZXRSdWxlQ29udGV4dChpLCBTdWJwcm9jZXNzX2lkQ29udGV4dCk7XG5cdFx0fVxuXHR9XG5cdHB1YmxpYyBET1QoKTogVGVybWluYWxOb2RlW107XG5cdHB1YmxpYyBET1QoaTogbnVtYmVyKTogVGVybWluYWxOb2RlO1xuXHRwdWJsaWMgRE9UKGk/OiBudW1iZXIpOiBUZXJtaW5hbE5vZGUgfCBUZXJtaW5hbE5vZGVbXSB7XG5cdFx0aWYgKGkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0VG9rZW5zKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5ET1QpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZXRUb2tlbihiaW5kaW5nX2dyYW1tYXJQYXJzZXIuRE9ULCBpKTtcblx0XHR9XG5cdH1cblx0Y29uc3RydWN0b3IocGFyZW50OiBQYXJzZXJSdWxlQ29udGV4dCwgaW52b2tpbmdTdGF0ZTogbnVtYmVyKTtcblx0Y29uc3RydWN0b3IocGFyZW50OiBQYXJzZXJSdWxlQ29udGV4dCwgaW52b2tpbmdTdGF0ZTogbnVtYmVyKSB7XG5cdFx0c3VwZXIocGFyZW50LCBpbnZva2luZ1N0YXRlKTtcblxuXHR9XG5cdEBPdmVycmlkZSBwdWJsaWMgZ2V0IHJ1bGVJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfcm9sZV9wYXRoX2V4cHJlc2lvbjsgfVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGVudGVyUnVsZShsaXN0ZW5lcjogYmluZGluZ19ncmFtbWFyTGlzdGVuZXIpOiB2b2lkIHtcblx0XHRpZiAobGlzdGVuZXIuZW50ZXJSb2xlX3BhdGhfZXhwcmVzaW9uKSBsaXN0ZW5lci5lbnRlclJvbGVfcGF0aF9leHByZXNpb24odGhpcyk7XG5cdH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBleGl0UnVsZShsaXN0ZW5lcjogYmluZGluZ19ncmFtbWFyTGlzdGVuZXIpOiB2b2lkIHtcblx0XHRpZiAobGlzdGVuZXIuZXhpdFJvbGVfcGF0aF9leHByZXNpb24pIGxpc3RlbmVyLmV4aXRSb2xlX3BhdGhfZXhwcmVzaW9uKHRoaXMpO1xuXHR9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgYWNjZXB0PFJlc3VsdD4odmlzaXRvcjogYmluZGluZ19ncmFtbWFyVmlzaXRvcjxSZXN1bHQ+KTogUmVzdWx0IHtcblx0XHRpZiAodmlzaXRvci52aXNpdFJvbGVfcGF0aF9leHByZXNpb24pIHJldHVybiB2aXNpdG9yLnZpc2l0Um9sZV9wYXRoX2V4cHJlc2lvbih0aGlzKTtcblx0XHRlbHNlIHJldHVybiB2aXNpdG9yLnZpc2l0Q2hpbGRyZW4odGhpcyk7XG5cdH1cbn1cblxuXG5leHBvcnQgY2xhc3MgU3VicHJvY2Vzc19pZENvbnRleHQgZXh0ZW5kcyBQYXJzZXJSdWxlQ29udGV4dCB7XG5cdHB1YmxpYyBJREVOVElGSUVSKCk6IFRlcm1pbmFsTm9kZSB7IHJldHVybiB0aGlzLmdldFRva2VuKGJpbmRpbmdfZ3JhbW1hclBhcnNlci5JREVOVElGSUVSLCAwKTsgfVxuXHRjb25zdHJ1Y3RvcihwYXJlbnQ6IFBhcnNlclJ1bGVDb250ZXh0LCBpbnZva2luZ1N0YXRlOiBudW1iZXIpO1xuXHRjb25zdHJ1Y3RvcihwYXJlbnQ6IFBhcnNlclJ1bGVDb250ZXh0LCBpbnZva2luZ1N0YXRlOiBudW1iZXIpIHtcblx0XHRzdXBlcihwYXJlbnQsIGludm9raW5nU3RhdGUpO1xuXG5cdH1cblx0QE92ZXJyaWRlIHB1YmxpYyBnZXQgcnVsZUluZGV4KCk6IG51bWJlciB7IHJldHVybiBiaW5kaW5nX2dyYW1tYXJQYXJzZXIuUlVMRV9zdWJwcm9jZXNzX2lkOyB9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgZW50ZXJSdWxlKGxpc3RlbmVyOiBiaW5kaW5nX2dyYW1tYXJMaXN0ZW5lcik6IHZvaWQge1xuXHRcdGlmIChsaXN0ZW5lci5lbnRlclN1YnByb2Nlc3NfaWQpIGxpc3RlbmVyLmVudGVyU3VicHJvY2Vzc19pZCh0aGlzKTtcblx0fVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGV4aXRSdWxlKGxpc3RlbmVyOiBiaW5kaW5nX2dyYW1tYXJMaXN0ZW5lcik6IHZvaWQge1xuXHRcdGlmIChsaXN0ZW5lci5leGl0U3VicHJvY2Vzc19pZCkgbGlzdGVuZXIuZXhpdFN1YnByb2Nlc3NfaWQodGhpcyk7XG5cdH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBhY2NlcHQ8UmVzdWx0Pih2aXNpdG9yOiBiaW5kaW5nX2dyYW1tYXJWaXNpdG9yPFJlc3VsdD4pOiBSZXN1bHQge1xuXHRcdGlmICh2aXNpdG9yLnZpc2l0U3VicHJvY2Vzc19pZCkgcmV0dXJuIHZpc2l0b3IudmlzaXRTdWJwcm9jZXNzX2lkKHRoaXMpO1xuXHRcdGVsc2UgcmV0dXJuIHZpc2l0b3IudmlzaXRDaGlsZHJlbih0aGlzKTtcblx0fVxufVxuXG5cbmV4cG9ydCBjbGFzcyBSb2xlX2lkQ29udGV4dCBleHRlbmRzIFBhcnNlclJ1bGVDb250ZXh0IHtcblx0cHVibGljIElERU5USUZJRVIoKTogVGVybWluYWxOb2RlIHsgcmV0dXJuIHRoaXMuZ2V0VG9rZW4oYmluZGluZ19ncmFtbWFyUGFyc2VyLklERU5USUZJRVIsIDApOyB9XG5cdGNvbnN0cnVjdG9yKHBhcmVudDogUGFyc2VyUnVsZUNvbnRleHQsIGludm9raW5nU3RhdGU6IG51bWJlcik7XG5cdGNvbnN0cnVjdG9yKHBhcmVudDogUGFyc2VyUnVsZUNvbnRleHQsIGludm9raW5nU3RhdGU6IG51bWJlcikge1xuXHRcdHN1cGVyKHBhcmVudCwgaW52b2tpbmdTdGF0ZSk7XG5cblx0fVxuXHRAT3ZlcnJpZGUgcHVibGljIGdldCBydWxlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIGJpbmRpbmdfZ3JhbW1hclBhcnNlci5SVUxFX3JvbGVfaWQ7IH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBlbnRlclJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmVudGVyUm9sZV9pZCkgbGlzdGVuZXIuZW50ZXJSb2xlX2lkKHRoaXMpO1xuXHR9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgZXhpdFJ1bGUobGlzdGVuZXI6IGJpbmRpbmdfZ3JhbW1hckxpc3RlbmVyKTogdm9pZCB7XG5cdFx0aWYgKGxpc3RlbmVyLmV4aXRSb2xlX2lkKSBsaXN0ZW5lci5leGl0Um9sZV9pZCh0aGlzKTtcblx0fVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGFjY2VwdDxSZXN1bHQ+KHZpc2l0b3I6IGJpbmRpbmdfZ3JhbW1hclZpc2l0b3I8UmVzdWx0Pik6IFJlc3VsdCB7XG5cdFx0aWYgKHZpc2l0b3IudmlzaXRSb2xlX2lkKSByZXR1cm4gdmlzaXRvci52aXNpdFJvbGVfaWQodGhpcyk7XG5cdFx0ZWxzZSByZXR1cm4gdmlzaXRvci52aXNpdENoaWxkcmVuKHRoaXMpO1xuXHR9XG59XG5cblxuZXhwb3J0IGNsYXNzIFRhc2tfaWRDb250ZXh0IGV4dGVuZHMgUGFyc2VyUnVsZUNvbnRleHQge1xuXHRwdWJsaWMgSURFTlRJRklFUigpOiBUZXJtaW5hbE5vZGUgeyByZXR1cm4gdGhpcy5nZXRUb2tlbihiaW5kaW5nX2dyYW1tYXJQYXJzZXIuSURFTlRJRklFUiwgMCk7IH1cblx0Y29uc3RydWN0b3IocGFyZW50OiBQYXJzZXJSdWxlQ29udGV4dCwgaW52b2tpbmdTdGF0ZTogbnVtYmVyKTtcblx0Y29uc3RydWN0b3IocGFyZW50OiBQYXJzZXJSdWxlQ29udGV4dCwgaW52b2tpbmdTdGF0ZTogbnVtYmVyKSB7XG5cdFx0c3VwZXIocGFyZW50LCBpbnZva2luZ1N0YXRlKTtcblxuXHR9XG5cdEBPdmVycmlkZSBwdWJsaWMgZ2V0IHJ1bGVJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gYmluZGluZ19ncmFtbWFyUGFyc2VyLlJVTEVfdGFza19pZDsgfVxuXHRAT3ZlcnJpZGVcblx0cHVibGljIGVudGVyUnVsZShsaXN0ZW5lcjogYmluZGluZ19ncmFtbWFyTGlzdGVuZXIpOiB2b2lkIHtcblx0XHRpZiAobGlzdGVuZXIuZW50ZXJUYXNrX2lkKSBsaXN0ZW5lci5lbnRlclRhc2tfaWQodGhpcyk7XG5cdH1cblx0QE92ZXJyaWRlXG5cdHB1YmxpYyBleGl0UnVsZShsaXN0ZW5lcjogYmluZGluZ19ncmFtbWFyTGlzdGVuZXIpOiB2b2lkIHtcblx0XHRpZiAobGlzdGVuZXIuZXhpdFRhc2tfaWQpIGxpc3RlbmVyLmV4aXRUYXNrX2lkKHRoaXMpO1xuXHR9XG5cdEBPdmVycmlkZVxuXHRwdWJsaWMgYWNjZXB0PFJlc3VsdD4odmlzaXRvcjogYmluZGluZ19ncmFtbWFyVmlzaXRvcjxSZXN1bHQ+KTogUmVzdWx0IHtcblx0XHRpZiAodmlzaXRvci52aXNpdFRhc2tfaWQpIHJldHVybiB2aXNpdG9yLnZpc2l0VGFza19pZCh0aGlzKTtcblx0XHRlbHNlIHJldHVybiB2aXNpdG9yLnZpc2l0Q2hpbGRyZW4odGhpcyk7XG5cdH1cbn1cblxuXG4iXX0=