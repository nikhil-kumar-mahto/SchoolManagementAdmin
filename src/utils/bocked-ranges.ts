import moment from "moment";

let blockedRanges = [];

export function addBlockedRange(start, end) {
  blockedRanges = blockedRanges.filter(
    ({ start: s, end: e }) =>
      !(
        moment(start, "HH:mm").isSame(moment(s, "HH:mm")) &&
        moment(end, "HH:mm").isSame(moment(e, "HH:mm"))
      )
  );

  blockedRanges.push({ start, end });
}

export function removeBlockedRange(start, end) {
  blockedRanges = blockedRanges.filter(
    ({ start: s, end: e }) =>
      !(
        moment(start, "HH:mm").isSame(moment(s, "HH:mm")) &&
        moment(end, "HH:mm").isSame(moment(e, "HH:mm"))
      )
  );
}

export function getBlockedRanges() {
  return blockedRanges;
}
