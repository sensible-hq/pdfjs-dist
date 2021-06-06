/**
 * @licstart The following is the entire license notice for the
 * Javascript code in this page
 *
 * Copyright 2021 Mozilla Foundation
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
 *
 * @licend The above is the entire license notice for the
 * Javascript code in this page
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XFAFactory = void 0;

var _xfa_object = require("./xfa_object.js");

var _bind = require("./bind.js");

var _parser = require("./parser.js");

class XFAFactory {
  constructor(data) {
    try {
      this.root = new _parser.XFAParser().parse(XFAFactory._createDocument(data));
      this.form = new _bind.Binder(this.root).bind();

      this._createPages();
    } catch (e) {
      console.log(e);
    }
  }

  _createPages() {
    this.pages = this.form[_xfa_object.$toHTML]();
    this.dims = this.pages.children.map(c => {
      const {
        width,
        height
      } = c.attributes.style;
      return [0, 0, parseInt(width), parseInt(height)];
    });
  }

  getBoundingBox(pageIndex) {
    return this.dims[pageIndex];
  }

  get numberPages() {
    return this.dims.length;
  }

  getPages() {
    if (!this.pages) {
      this._createPages();
    }

    const pages = this.pages;
    this.pages = null;
    return pages;
  }

  static _createDocument(data) {
    if (!data["/xdp:xdp"]) {
      return data["xdp:xdp"];
    }

    return Object.values(data).join("");
  }

}

exports.XFAFactory = XFAFactory;