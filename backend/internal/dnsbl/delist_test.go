package dnsbl

import "testing"

func TestDelistCoversAllLists(t *testing.T) {
	for _, zone := range Lists {
		if _, ok := DelistByZone[zone]; !ok {
			t.Errorf("missing DelistByZone for %s", zone)
		}
	}
}
