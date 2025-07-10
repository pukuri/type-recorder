class ReplayableAnswer < ApplicationRecord
  belongs_to :question
  
  validates :username, presence: true
  validates :recording_data, presence: true
  
  before_save :generate_uuid, if: :new_record?
  
  private
  
  def generate_uuid
    require 'securerandom'
    self.uuid = SecureRandom.uuid if uuid.blank?
  end
end