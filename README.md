# libclassic

a library for wow classic web apps. 

- used by: https://github.com/ultrabis/moonkin
- codepen: https://codepen.io/beef_broccoli/pen/eYJRovW
- goal: port more spreadsheets

![build](https://github.com/ultrabis/libclassic/workflows/build/badge.svg) ![publish](https://github.com/ultrabis/libclassic/workflows/publish/badge.svg)

### faq

q. why is the bundle so large?
a. it includes everything (databases, icons, etc). there are plans to create new release bundle types.

q. when will it support my class / spec?
a. mage is the next goal.

q. why does the code suck?
a. the plan is to rewrite most of `./src/class`  as plain old functions. 


### credits

- originally [keftenks balance druid spreadsheet](https://forum.classicwow.live/topic/726/by-the-great-winds-i-come-classic-balance-druid-theorycraft-spreadsheet-v1-5-1/16)
- ported to [moonkin-calc](https://gitlab.com/kmmiles/moonkin-calc) by beefbroccoli
- with balors damage and weighting math (see contrib/whitepaper)


