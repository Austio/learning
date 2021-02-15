require 'action_controller/railtie'
require 'rails_event_store'
require 'aggregate_root'
require 'arkency/command_bus'
require 'ostruct'
require_relative "./lib/db"

SURVEYS = {
  1 => OpenStruct.new(
    id: 1,
    name: "What is your favorite weekend activity?",
    options: ["Netflix", "Gaming", "Dining", "NightClub"],
    selections: {},
  )
}

# Domain

class Survey
  include AggregateRoot

  OptionSelected = Class.new(RailsEventStore::Event)

  def self.first
    new(SURVEYS[1])
  end

  def self.find_by_id(id)
    new(SURVEYS[id])
  end

  def initialize(state)
    @state = state
  end

  def id
    @state.id
  end

  def name
    @state.name
  end

  def options
    @state.options
  end

  def times_options_selected(option)
    @state.selections[option] || 0
  end

  class OptionNotAvailable < StandardError; end
  def select_option(option)
    raise OptionNotAvailable unless options.include? option

    apply OptionSelected.new(data: { option: option, survey_id: self.id })
  end

  def increment_option(option)
    if !@state.selections[option]
      @state.selections[option] = 1
    else
      @state.selections[option] += 1
    end
  end

  private

  on OptionSelected do |event|
    survey = Survey.find_by_id(event.data[:survey_id])

    survey.increment_option(event.data[:option])
  end
end

class SurveyApp < Rails::Application
  config.eager_load = true # necessary to silence warning
  config.logger = ActiveSupport::TaggedLogging.new(Logger.new(STDOUT))
  config.secret_key_base = SecureRandom.uuid    # Rails won't start without this
  config.action_dispatch.default_headers = { 'X-Frame-Options' => 'ALLOWALL' }
  routes.append { root :to => "survey#index" }
  routes.append { post "/survey" => "survey#index" }
  routes.append { mount RailsEventStore::Browser => '/events' if Rails.env.development? }

  Rails.configuration.to_prepare do
    Rails.configuration.event_store = RailsEventStore::Client.new
    Rails.configuration.command_bus = Arkency::CommandBus.new

    AggregateRoot.configure do |config|
      config.default_event_store = Rails.configuration.event_store
    end

    # Subscribe event handlers below
    Rails.configuration.event_store.tap do |store|
      # store.subscribe(InvoiceReadModel.new, to: [InvoicePrinted])
      # store.subscribe(lambda { |event| SendOrderConfirmation.new.call(event) }, to: [OrderSubmitted])
      # store.subscribe_to_all_events(lambda { |event| Rails.logger.info(event.event_type) })

      store.subscribe_to_all_events(RailsEventStore::LinkByEventType.new)
      store.subscribe_to_all_events(RailsEventStore::LinkByCorrelationId.new)
      store.subscribe_to_all_events(RailsEventStore::LinkByCausationId.new)


      store.subscribe(Survey::OnOptionSelected.new, to: [Survey::OptionSelected])
    end


    # Register command handlers below
    # Rails.configuration.command_bus.tap do |bus|
    #   bus.register(PrintInvoice, Invoicing::OnPrint.new)
    #   bus.register(SubmitOrder,  ->(cmd) { Ordering::OnSubmitOrder.new.call(cmd) })
    # end
  end
end

class SurveyController < ActionController::Base
  @@responses = {}
  def index
    choice = params["activity_choice"]
    if choice
      Survey.first.select_option(choice)

      render html: results_html(choice).html_safe
    else
      render html: form_html.html_safe
    end
  end

  def form_html
    form_start = <<-FORM_START_HTML
    <nav>  
      <a href="/">Surveys</a>
      <a href="/events">Event History</a>
    </nav>
    <h3>#{Survey.first.name}</h3>
    <form method="post" action="survey">
    FORM_START_HTML

    form_end = <<-FORM_END_HTML
	  <br/><br/><div class="12u$">
		<input type="submit" value="Submit" style="background-color: #5AA6ED; color: #ffffff !important; font-family: Taviraj, serif; font-size: 18; height: 26; padding: 0; border-radius: 5px; width: 100; vertical-align: middle;" />
	  </div>
    </form>
    FORM_END_HTML

    buffer = form_start
    Survey.first.options.each do |choice|
      buffer = "#{buffer}#{button_html(choice)}"
    end
    "#{buffer}#{form_end}"
  end

  def button_html(choice)
    <<-CHOICE_HTML
      <div class="4u 12u$(small)">
	      <input type="radio" id="#{choice}" name="activity_choice" value="#{choice}" style="font-family: Taviraj, serif;">
		    <label for="netflix">#{choice}</label>
	    </div>
    CHOICE_HTML
  end

  def results_html(answer)
    header = <<-RESULTS_HTML
    <h3>What is your favorite weekend activity?</h3><div style="color: #A9A9A9">
    Thanks for participating? You chose <span style="color: #8FC0F1">#{answer}</span>. Overall results:<br/></div><hr/>
    <div class="container horizontal rounded">
    RESULTS_HTML

    survey = Survey.first

    buffer = ""
    survey.options.each do |choice|
      count = survey.times_options_selected(choice)
      count = 0 unless not count.nil?
      buffer = "#{buffer}<pre>#{choice.rjust(10, ' ')}: #{count}</pre>"
    end

    "#{header}#{buffer}</div>"
  end
end

SurveyApp.initialize!
run SurveyApp