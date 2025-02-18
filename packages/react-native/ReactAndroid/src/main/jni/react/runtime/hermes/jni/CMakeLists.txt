# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

file(GLOB_RECURSE hermes_instance_jni_SRC CONFIGURE_DEPENDS *.cpp)

add_library(hermesinstancejni
        SHARED
        ${hermes_instance_jni_SRC}
)
target_compile_options(
        hermesinstancejni
        PRIVATE
        -DHERMES_ENABLE_DEBUGGER=1
        -std=c++20
        -fexceptions
)
target_include_directories(hermesinstancejni PRIVATE .)
target_link_libraries(
        hermesinstancejni
        hermes-engine::libhermes
        rninstance
        fbjni
        bridgelesshermes
)
