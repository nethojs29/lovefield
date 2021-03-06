/**
 * @license
 * Copyright 2014 The Lovefield Project Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
goog.setTestOnly();
goog.require('goog.Promise');
goog.require('goog.testing.TestCase');
goog.require('goog.testing.jsunit');
goog.require('hr.db');
goog.require('lf.Capability');
goog.require('lf.schema.DataStoreType');
goog.require('lf.testing.SmokeTester');
goog.require('order.db');


/** @type {!lf.testing.SmokeTester} */
var hrTester;


/** @type {!lf.testing.SmokeTester} */
var orderTester;


/** @type {!lf.Capability} */
var capability;


function setUpPage() {
  goog.testing.TestCase.getActiveTestCase().promiseTimeout = 5 * 1000;  // 5s
}

function setUp() {
  capability = lf.Capability.get();

  var options = {
    storeType: !capability.indexedDb ? lf.schema.DataStoreType.MEMORY :
        lf.schema.DataStoreType.INDEXED_DB
  };
  return goog.Promise.all([
    hr.db.connect(options),
    order.db.connect(options)
  ]).then(function(dbs) {
    hrTester = new lf.testing.SmokeTester(hr.db.getGlobal(), dbs[0]);
    orderTester = new lf.testing.SmokeTester(order.db.getGlobal(), dbs[1]);

    return goog.Promise.all([hrTester.clearDb(), orderTester.clearDb()]);
  });
}


function testCRUD() {
  return goog.Promise.all([hrTester.testCRUD(), orderTester.testCRUD()]);
}
