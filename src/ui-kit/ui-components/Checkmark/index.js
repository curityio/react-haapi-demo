/*
 *  Copyright 2022 Curity AB
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import React from "react";

const Logo = () => {
  return (
    <div class="checkmark-wrapper">
      <svg
        className="checkmark"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
      >
        <circle
          className="checkmark-circle"
          cx={26}
          cy={26}
          r={25}
          fill="none"
        />
        <path
          className="checkmark-check"
          fill="none"
          d="m14.1 27.2 7.1 7.2 16.7-16.8"
        />
      </svg>
    </div>
  );
};

export default Logo;
