#!/bin/sh

node --harmony --harmony_modules --harmony_destructuring --harmony_rest_parameters --harmony_arrow_functions --harmony_spreadcalls --harmony_object --harmony_default_parameters --harmony_reflect lib/index.js "$@"

