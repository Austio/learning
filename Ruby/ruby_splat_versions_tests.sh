versions=('2.7.6' '3.0.2' '3.1.2')

for i in "${versions[@]}"
do
  export RBENV_VERSION="$i"
#  gem install bundler pry rspec
  ruby ./ruby_splat_versions_tests.rb
done
