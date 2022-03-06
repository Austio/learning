module HasUuid
  def uuid
    @_has_uuid = @_has_uuid || SecureRandom.uuid
  end

  private

  def init_uuid!
    uuid
  end
end
