'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

// employees.js manages a list of employee records stored as an array
// in the JSON file.  The getter returns the array so that callers can
// iterate or select individual employees as needed.
const employees = {

  // initialize default data structure to an empty array
  store: new JsonStore('./models/employees.json', { employees: {} }),
  collection: 'employees',

  /**
   * Return all employee objects from the store.
   * Previously this module held a single "employee" object, so the
   * method was called getAppInfo.  With the switch to an array it now
   * makes sense to treat it as a list of employees.
   */
  getAll() {
    return this.store.findAll(this.collection);
  },

};

export default employees;
