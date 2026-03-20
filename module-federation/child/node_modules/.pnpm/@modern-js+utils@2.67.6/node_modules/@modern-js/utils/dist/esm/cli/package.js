import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { execa } from "../compiled";
function getPnpmVersion() {
  return _getPnpmVersion.apply(this, arguments);
}
function _getPnpmVersion() {
  _getPnpmVersion = _async_to_generator(function() {
    var stdout;
    return _ts_generator(this, function(_state) {
      switch (_state.label) {
        case 0:
          return [
            4,
            execa("pnpm", [
              "--version"
            ])
          ];
        case 1:
          stdout = _state.sent().stdout;
          return [
            2,
            stdout
          ];
      }
    });
  });
  return _getPnpmVersion.apply(this, arguments);
}
function canUseNpm() {
  return _canUseNpm.apply(this, arguments);
}
function _canUseNpm() {
  _canUseNpm = _async_to_generator(function() {
    var e;
    return _ts_generator(this, function(_state) {
      switch (_state.label) {
        case 0:
          _state.trys.push([
            0,
            2,
            ,
            3
          ]);
          return [
            4,
            execa("npm", [
              "--version"
            ], {
              env: process.env
            })
          ];
        case 1:
          _state.sent();
          return [
            2,
            true
          ];
        case 2:
          e = _state.sent();
          return [
            2,
            false
          ];
        case 3:
          return [
            2
          ];
      }
    });
  });
  return _canUseNpm.apply(this, arguments);
}
function canUseYarn() {
  return _canUseYarn.apply(this, arguments);
}
function _canUseYarn() {
  _canUseYarn = _async_to_generator(function() {
    var e;
    return _ts_generator(this, function(_state) {
      switch (_state.label) {
        case 0:
          _state.trys.push([
            0,
            2,
            ,
            3
          ]);
          return [
            4,
            execa("yarn", [
              "--version"
            ], {
              env: process.env
            })
          ];
        case 1:
          _state.sent();
          return [
            2,
            true
          ];
        case 2:
          e = _state.sent();
          return [
            2,
            false
          ];
        case 3:
          return [
            2
          ];
      }
    });
  });
  return _canUseYarn.apply(this, arguments);
}
function canUsePnpm() {
  return _canUsePnpm.apply(this, arguments);
}
function _canUsePnpm() {
  _canUsePnpm = _async_to_generator(function() {
    var e;
    return _ts_generator(this, function(_state) {
      switch (_state.label) {
        case 0:
          _state.trys.push([
            0,
            2,
            ,
            3
          ]);
          return [
            4,
            execa("pnpm", [
              "--version"
            ], {
              env: process.env
            })
          ];
        case 1:
          _state.sent();
          return [
            2,
            true
          ];
        case 2:
          e = _state.sent();
          return [
            2,
            false
          ];
        case 3:
          return [
            2
          ];
      }
    });
  });
  return _canUsePnpm.apply(this, arguments);
}
export {
  canUseNpm,
  canUsePnpm,
  canUseYarn,
  getPnpmVersion
};
