class Question < ApplicationRecord
  has_many :replayable_answers, dependent: :destroy
  
  validates :content, presence: true
end