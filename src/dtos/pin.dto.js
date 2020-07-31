export class PinDto {
  pinName = '';
  boardName = '';
  pinType = '';

  loadForward() {
    return {
      'pin_name': this.pinName,
      'board_name': this.boardName,
      'type': this.pinType
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
