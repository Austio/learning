## Getting Started

Good other walkthrough for running into anything: https://www.intermediateruby.com/rebuilding-rails-course-walkthrough

### Init the Repo
 - bundle gem ruler
 - add rack dependency

### Enable Rack
 - create a 'config.ru' file that exposes a proc
 - run rackup -p 3001

### Testing

Here we add a test directory with some simple RackTest things, you can run with "ruby test/*.rb"

### Building and installing

Iterating right now will not be super fun it requires
 - gem uninstall ruler
 - gem build
 - gem install ruler
 - bundler install ruler
