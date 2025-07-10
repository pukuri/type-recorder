Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :questions, only: [:index, :show]
      resources :replayable_answers, only: [:create, :show, :index]
    end
  end
end