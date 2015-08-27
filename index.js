'use strict';

const isFn = function isFn(fn) {
  return (typeof fn === 'function');
};

const placeholder = {};

// `_parent` and `_name` is private, don't use it!
const visit = function visit(target, _parent, _name) {
  const value = target != null ? target : placeholder;
  const wrapper = {
    value: value,
    parent: _parent,
    name: _name
  };
  return new Proxy(wrapper, handler);
};

const isExist = function isExist(value) {
  return value != null && value !== placeholder;
};
const unwrap = function unwrap(value, defaultValue) {
  return isExist(value) ? value : defaultValue;
};
const set = function set(parent, name, value) {
  if (!isExist(parent)) return false;

  parent[name] = value;
  return true;
};

const noop = function() {};
const handler = {
  get(target, prop) {
    const value = target.value;
    switch (prop) {
    case 'isExist': return isExist.bind(null, value);
    case 'unwrap': return unwrap.bind(null, value);
    case 'invoke': return isFn(value) ? value.bind(target.parent) : noop;
    case 'set': return set.bind(null, target.parent, target.name);
    default: return visit(value[prop], value, prop);
    }
  }
};

module.exports = visit;
