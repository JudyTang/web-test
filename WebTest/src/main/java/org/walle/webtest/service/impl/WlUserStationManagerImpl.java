package org.walle.webtest.service.impl;

import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Service;

import cn.walle.framework.core.service.impl.BaseManagerImpl;

import org.walle.webtest.model.WlUserStationModel;
import org.walle.webtest.service.WlUserStationManager;

@Service
public class WlUserStationManagerImpl extends BaseManagerImpl implements WlUserStationManager {

	@Override
	public WlUserStationModel save(WlUserStationModel model) {
		return this.dao.save(model);
	}

	@Override
	public List<WlUserStationModel> saveAll(Collection<WlUserStationModel> models) {
		return this.dao.saveAll(models);
	}

	@Override
	public List<WlUserStationModel> saveTreeData(Collection<WlUserStationModel> models, String idField, String parentField) {
		return this.dao.saveTreeData(models, idField, parentField);
	}

	@Override
	public void remove(WlUserStationModel model) {
		this.dao.remove(model);
	}

	@Override
	public void removeAll(Collection<WlUserStationModel> models) {
		this.dao.removeAll(models);
	}

}
