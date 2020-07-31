#!/bin/bash

__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
__file="${__dir}/$(basename "${BASH_SOURCE[0]}")"
__root="$(cd "$(dirname "${__dir}")" && pwd)"

set -o errexit
set -o pipefail
set -o nounset

emptyContent='{"validSuffixIds":[]}'

for file in $(find ${__root}/contrib/wowhead -type f -name "*.json"); do
  baseFile="$(basename $file)"
  content="$(cat $file)"

  if [ "$content" == "$emptyContent" ]; then
    echo "$baseFile is empty"
    #rm -f "$file"
  fi
done
