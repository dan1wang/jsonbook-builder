# jsonbook

[Wiktionary](https://en.wiktionary.org/) dump in accessible `JSON` format.

[enwiktionary-link]: https://dumps.wikimedia.org/enwiktionary/latest/enwiktionary-latest-pages-articles.xml.bz2

## Why

The English Wiktionary gracefully provides regular dumps of all its content
so anyone can easily parse the content for his/her own use. Unfortunately,
the _parsing_ part can be daunting and quickly turn any interested developer
off. This is because:

* The dump file is **very big** (5.5Gb uncompressed)
* The dump file contains many **other things** like discussion pages.
* Wiktionary is a _dictionary in English_, not a _English dictionary_, so
  its entries includes a lot of non-English words.
* The entries aren't in alphabetical order.  

In other words, to get to the content you want, you have first filter through a
lot of things you aren't remotely interested in. Or, you can spam the system
with lots of API calls.

## Solution

**Jsonbook** helps remove the first road block of your making
awesome use of the Wiktionary dump. It does the following:

1. Retrieve only the word articles
2. Organize all the articles by language
3. Convert the text to hierarchical tree
4. Save all the content to individual `JSON` files.

See a [sample output](doc/sample-output.tar.bz2) of the entry for "gratis".
