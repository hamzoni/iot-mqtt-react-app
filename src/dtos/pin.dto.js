export class PinDto {
  pinName = '';
  boardName = '';
  pinType = '';

  static loadForward(dto) {
    return {
      'pin_name': dto.pinName,
      'board_name': dto.boardName,
      'type': dto.pinType
    };
  }

  static loadBackward(response) {
    const dto = new PinDto();
    dto.pinName = response['pin_name'];
    dto.boardName = response['board_name'];
    dto.pinType = response['type'];
    return dto;
  }
}
